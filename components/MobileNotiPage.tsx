
import React, { useState, useEffect } from 'react';
import { DevicePhoneMobileIcon, BellAlertIcon, SpeakerWaveIcon, XIcon, CheckCircleIcon, LoadingSpinner } from './icons';
import { supabase } from '../supabaseClient';
import { Device } from '../types';

interface MobileNotiPageProps {}

const MobileNotiPage: React.FC<MobileNotiPageProps> = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
    const [actionType, setActionType] = useState<'notification' | 'warning' | null>(null);
    
    // Notification Form State
    const [notiTitle, setNotiTitle] = useState('');
    const [notiBody, setNotiBody] = useState('');
    
    // Warning Form State
    const [warningMessage, setWarningMessage] = useState('');

    const [processing, setProcessing] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    useEffect(() => {
        fetchDevices();
        
        // Listen for new devices appearing online
        const channel = supabase
            .channel('public:devices')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'devices' }, () => {
                fetchDevices();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const fetchDevices = async () => {
        try {
            const { data, error } = await supabase
                .from('devices')
                .select('*')
                .order('last_active', { ascending: false });
            
            if (error) throw error;
            setDevices(data || []);
        } catch (error: any) {
            console.error('Error fetching devices:', error.message || error);
        } finally {
            setIsLoading(false);
        }
    };

    const openAction = (device: Device, type: 'notification' | 'warning') => {
        setSelectedDevice(device);
        setActionType(type);
        setNotiTitle('');
        setNotiBody('');
        setWarningMessage('');
        setSuccessMsg('');
    };

    const closeAction = () => {
        setSelectedDevice(null);
        setActionType(null);
        setSuccessMsg('');
    };

    const handleSendNotification = async () => {
        if (!notiTitle || !notiBody || !selectedDevice) return;
        setProcessing(true);
        
        try {
            const { error } = await supabase
                .from('notifications')
                .insert({
                    target_device_id: selectedDevice.id,
                    title: notiTitle,
                    body: notiBody,
                    type: 'notification'
                });

            if (error) throw error;

            setSuccessMsg(`Notification sent to ${selectedDevice.device_name}`);
            setTimeout(closeAction, 2000);
        } catch (error: any) {
            console.error('Error sending notification:', error.message || error);
            alert(`Failed to send notification: ${error.message || 'Unknown error'}`);
        } finally {
            setProcessing(false);
        }
    };

    const handleSendWarning = async () => {
        if (!warningMessage || !selectedDevice) return;
        setProcessing(true);

        try {
            // Trigger ALARM logic by writing to notifications table with type 'warning'
            const { error } = await supabase
                .from('notifications')
                .insert({
                    target_device_id: selectedDevice.id,
                    title: 'CRITICAL ALERT',
                    body: warningMessage,
                    type: 'warning'
                });

            if (error) throw error;

            setSuccessMsg(`ALARM TRIGGERED on ${selectedDevice.device_name}`);
            setTimeout(closeAction, 2000);
        } catch (error: any) {
            console.error('Error sending warning:', error.message || error);
            alert(`Failed to trigger alarm: ${error.message || 'Unknown error'}`);
        } finally {
            setProcessing(false);
        }
    };

    const getTimeAgo = (dateString: string) => {
        const diff = Date.now() - new Date(dateString).getTime();
        const minutes = Math.floor(diff / 60000);
        if (minutes < 1) return 'Just now';
        if (minutes < 60) return `${minutes} mins ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hours ago`;
        return `${Math.floor(hours / 24)} days ago`;
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 text-neutral-900 bg-neutral-100 h-full flex flex-col">
            <div className="flex-shrink-0 mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <DevicePhoneMobileIcon className="h-8 w-8 text-yellow-500" />
                    Mobile Control Center (LIVE)
                </h2>
                <p className="text-neutral-500 text-sm mt-1">Manage active devices and send real-time alerts.</p>
            </div>

            <div className="flex-grow overflow-auto">
                {isLoading ? (
                    <div className="flex justify-center items-center h-40">
                        <LoadingSpinner className="h-8 w-8 text-primary-600" />
                    </div>
                ) : devices.length === 0 ? (
                    <div className="text-center py-10 text-neutral-500">No active devices found. Open the app on a mobile device to register it.</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {devices.map(device => (
                            <div key={device.id} className="bg-white rounded-xl shadow-md border border-neutral-200 p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow relative">
                                {/* Online Status Indicator */}
                                <span className={`absolute top-4 right-4 h-3 w-3 rounded-full ${new Date(device.last_active).getTime() > Date.now() - 5 * 60 * 1000 ? 'bg-green-500 animate-pulse' : 'bg-gray-300'}`} title="Status"></span>
                                
                                <div className="bg-neutral-100 p-4 rounded-full mb-4">
                                    <DevicePhoneMobileIcon className="h-10 w-10 text-neutral-600" />
                                </div>
                                <h3 className="text-lg font-bold text-neutral-800 truncate w-full">{device.device_name}</h3>
                                <p className="text-xs text-neutral-500 mb-1">User: {device.user_id ? (device.user_id === '786786' ? 'Yusuf' : device.user_id === '667733' ? 'Akka' : device.user_id) : 'Guest'}</p>
                                <p className="text-sm text-green-600 font-medium mb-6">Active: {getTimeAgo(device.last_active)}</p>
                                
                                <div className="w-full grid grid-cols-2 gap-3">
                                    <button 
                                        onClick={() => openAction(device, 'notification')}
                                        className="flex flex-col items-center justify-center p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors border border-blue-200"
                                    >
                                        <BellAlertIcon className="h-6 w-6 mb-1" />
                                        <span className="text-xs font-bold">SEND APP NOTI</span>
                                    </button>
                                    <button 
                                        onClick={() => openAction(device, 'warning')}
                                        className="flex flex-col items-center justify-center p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors border border-red-200"
                                    >
                                        <SpeakerWaveIcon className="h-6 w-6 mb-1" />
                                        <span className="text-xs font-bold">WARNING</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedDevice && actionType && (
                <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all overflow-hidden">
                        <div className="bg-neutral-50 px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
                            <h3 className="text-lg font-bold text-neutral-800">
                                {actionType === 'notification' ? 'Send App Notification' : 'Trigger Warning Alarm'}
                            </h3>
                            <button onClick={closeAction} className="text-neutral-400 hover:text-neutral-600">
                                <XIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="p-6">
                            {successMsg ? (
                                <div className="flex flex-col items-center justify-center py-8 text-green-600 animate-fade-in">
                                    <CheckCircleIcon className="h-16 w-16 mb-4" />
                                    <p className="text-lg font-bold">{successMsg}</p>
                                </div>
                            ) : (
                                <>
                                    <p className="text-sm text-neutral-500 mb-4">
                                        Target: <span className="font-bold text-neutral-800">{selectedDevice.device_name}</span>
                                    </p>

                                    {actionType === 'notification' ? (
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-700">Title</label>
                                                <input 
                                                    type="text" 
                                                    value={notiTitle} 
                                                    onChange={(e) => setNotiTitle(e.target.value)} 
                                                    className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="e.g., New Lead Assigned"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-700">Message Body</label>
                                                <textarea 
                                                    value={notiBody} 
                                                    onChange={(e) => setNotiBody(e.target.value)} 
                                                    rows={3}
                                                    className="mt-1 block w-full border border-neutral-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
                                                    placeholder="Enter notification content..."
                                                ></textarea>
                                            </div>
                                            <button 
                                                onClick={handleSendNotification} 
                                                disabled={processing || !notiTitle || !notiBody}
                                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                            >
                                                {processing ? 'Sending...' : 'SEND NOTIFICATION'}
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
                                                <div className="flex">
                                                    <div className="flex-shrink-0">
                                                        <SpeakerWaveIcon className="h-5 w-5 text-red-500" />
                                                    </div>
                                                    <div className="ml-3">
                                                        <p className="text-sm text-red-700">
                                                            This will force the device to VIBRATE and play a loud sound even if silent (if app is open).
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-neutral-700">Warning Message</label>
                                                <input 
                                                    type="text" 
                                                    value={warningMessage} 
                                                    onChange={(e) => setWarningMessage(e.target.value)} 
                                                    className="mt-1 block w-full border border-red-300 rounded-md shadow-sm p-2 focus:ring-red-500 focus:border-red-500"
                                                    placeholder="e.g., URGENT: CHECK CRM IMMEDIATELY"
                                                />
                                            </div>
                                            <button 
                                                onClick={handleSendWarning} 
                                                disabled={processing || !warningMessage}
                                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 animate-pulse"
                                            >
                                                {processing ? 'Triggering...' : 'ALARM ON'}
                                            </button>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MobileNotiPage;
