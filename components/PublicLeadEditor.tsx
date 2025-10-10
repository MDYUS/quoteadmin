import React, { useState, useEffect } from 'react';
import { Lead, LeadStatus, FileInfo } from '../types';
import { supabase } from '../supabaseClient';
import { toCamel, toSnake, formatStatus } from '../utils';
import { STATUS_OPTIONS, LOGO_URL } from '../constants';
import { TrashIcon, DownloadIcon, FileIcon, LoadingSpinner, CheckCircleIcon, XCircleIcon } from './icons';

const PublicLeadEditor: React.FC<{ leadId: string }> = ({ leadId }) => {
    const [lead, setLead] = useState<Lead | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [loadingError, setLoadingError] = useState<string | null>(null);
    
    const [isSaving, setIsSaving] = useState(false);
    const [savingError, setSavingError] = useState<string | null>(null);
    const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
    
    const [formState, setFormState] = useState<Partial<Lead>>({});

    useEffect(() => {
        const fetchLead = async () => {
            try {
                const { data, error: dbError } = await supabase
                    .from('leads')
                    .select('*')
                    .eq('id', leadId)
                    .single();

                if (dbError) throw new Error(dbError.message);
                if (data) {
                    const fetchedLead = toCamel(data) as Lead;
                    setLead(fetchedLead);
                    setFormState(fetchedLead);
                } else {
                    throw new Error("Lead not found or you may not have permission to view it.");
                }
            } catch (err: any) {
                setLoadingError(`Failed to load lead details: ${err.message}`);
            } finally {
                setIsLoading(false);
            }
        };

        fetchLead();
    }, [leadId]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormState(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormState(prev => ({
                    ...prev,
                    floorPlan: {
                        name: file.name,
                        dataUrl: reader.result as string,
                        type: file.type
                    }
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = async () => {
        if (!lead) return;
        setIsSaving(true);
        setSavingError(null);

        try {
            const updateData = { ...formState };
            delete updateData.id; // Don't try to update the ID
            delete updateData.createdAt; // Don't try to update createdAt

            const { error: dbError } = await supabase
                .from('leads')
                .update(toSnake(updateData))
                .eq('id', lead.id);

            if (dbError) throw new Error(dbError.message);
            setSaveSuccess("Your details have been updated successfully. Thank you!");
        } catch (err: any) {
            setSavingError(`Failed to save changes: ${err.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const inputClass = "mt-1 block w-full border border-neutral-300 rounded-lg shadow-sm p-3 focus:ring-primary-500 focus:border-primary-500 bg-neutral-50 text-neutral-900 placeholder:text-neutral-400";
    
    if (isLoading) {
        return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner className="h-8 w-8 text-primary-600"/></div>;
    }

    if (loadingError) {
        return <div className="min-h-screen flex items-center justify-center p-4">
             <div className="text-center bg-red-50 p-6 rounded-lg border border-red-200">
                <XCircleIcon className="mx-auto h-12 w-12 text-red-400" />
                <h3 className="mt-2 text-lg font-medium text-red-900">An Error Occurred</h3>
                <p className="mt-1 text-sm text-red-700">{loadingError}</p>
             </div>
        </div>
    }

    if (saveSuccess) {
         return <div className="min-h-screen flex items-center justify-center p-4">
             <div className="text-center bg-green-50 p-8 rounded-lg border border-green-200 max-w-md animate-fade-in">
                <CheckCircleIcon className="mx-auto h-16 w-16 text-green-500" />
                <h3 className="mt-4 text-2xl font-bold text-green-900">Update Successful!</h3>
                <p className="mt-2 text-md text-green-700">{saveSuccess}</p>
             </div>
        </div>
    }

    return (
        <div className="min-h-screen bg-neutral-100 flex flex-col items-center p-4 sm:p-6 font-sans">
            <header className="text-center mb-6">
                <img src={LOGO_URL} alt="Company Logo" className="h-20 w-20 object-contain mx-auto" />
                <h1 className="text-2xl font-bold mt-3 text-neutral-900">Your Family Interior</h1>
                <p className="text-md text-neutral-600">Update Your Project Details</p>
            </header>

            <div className="bg-white rounded-xl shadow-lg border border-neutral-200 w-full max-w-3xl">
                <div className="p-6 space-y-6">
                    <h2 className="text-xl font-semibold text-neutral-800 border-b pb-3">Client: {formState.name}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-neutral-700">Phone</label>
                            <input type="text" id="phone" name="phone" value={formState.phone || ''} onChange={handleInputChange} className={inputClass} />
                        </div>
                        <div>
                            <label htmlFor="status" className="block text-sm font-medium text-neutral-700">Status</label>
                            <select id="status" name="status" value={formState.status} onChange={handleInputChange} className={inputClass}>
                                {STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{formatStatus(opt)}</option>)}
                            </select>
                        </div>
                        <div className="md:col-span-2">
                             <label className="block text-sm font-medium text-neutral-700">Floor Plan</label>
                            {!formState.floorPlan ? (
                                <label htmlFor="floorPlan" className="mt-1 cursor-pointer bg-white border-2 border-dashed border-neutral-300 rounded-lg p-4 flex flex-col items-center justify-center text-sm text-neutral-500 hover:bg-neutral-50">
                                    <FileIcon className="w-8 h-8 mx-auto text-neutral-400"/>
                                    <span className="mt-2">Upload a file (PDF, PNG, JPG)</span>
                                    <input id="floorPlan" type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} className="sr-only"/>
                                </label>
                            ) : (
                                <div className="mt-1 flex items-center justify-between border border-neutral-300 rounded-lg p-2.5">
                                    <span className="text-sm font-medium text-neutral-800 truncate">{formState.floorPlan.name}</span>
                                    <div className="flex items-center space-x-2">
                                        <a href={formState.floorPlan.dataUrl} download={formState.floorPlan.name} className="text-neutral-500 hover:text-neutral-700"><DownloadIcon/></a>
                                        <button onClick={() => setFormState(prev => ({...prev, floorPlan: null}))} className="text-red-500 hover:text-red-700"><TrashIcon/></button>
                                    </div>
                                </div>
                            )}
                        </div>
                        <div className="md:col-span-2">
                            <label htmlFor="details" className="block text-sm font-medium text-neutral-700">Details / Notes</label>
                            <textarea id="details" name="details" value={formState.details || ''} onChange={handleInputChange} rows={5} className={inputClass}></textarea>
                        </div>
                    </div>
                </div>
                 <div className="px-6 py-4 bg-neutral-50 rounded-b-xl flex flex-col sm:flex-row justify-end items-center gap-4">
                    {savingError && <p className="text-sm text-red-600 font-medium text-center sm:text-right flex-grow">{savingError}</p>}
                    <button onClick={handleSave} disabled={isSaving} className="w-full sm:w-auto flex justify-center items-center gap-2 px-6 py-3 bg-primary-600 text-white border border-transparent rounded-lg text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-wait transition-colors">
                        {isSaving ? (
                            <>
                                <LoadingSpinner className="h-5 w-5"/> Saving...
                            </>
                        ) : (
                            'Save Changes'
                        )}
                    </button>
                 </div>
            </div>
        </div>
    );
};

export default PublicLeadEditor;
