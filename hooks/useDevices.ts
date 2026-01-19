
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { getBrowserName } from '../utils';
import { Capacitor } from '@capacitor/core';

export const useDevices = (currentUserId: string | null) => {
    const [deviceId, setDeviceId] = useState<string | null>(null);

    useEffect(() => {
        const registerDevice = async () => {
            // STRICT FILTER: Only track if running as a native app (APK/IPA)
            // This prevents desktop/mobile web browsers from appearing in the list.
            if (!Capacitor.isNativePlatform()) {
                console.log('Not a native platform (Web/PWA), skipping device registration.');
                return;
            }

            let id = localStorage.getItem('amaz_device_id');
            if (!id) {
                id = crypto.randomUUID();
                localStorage.setItem('amaz_device_id', id);
            }
            setDeviceId(id);

            // Append (App) to distinguish clearly in the UI
            const deviceName = `${getBrowserName()} (App)`;

            // Upsert device info to Supabase
            try {
                const { error } = await supabase
                    .from('devices')
                    .upsert({
                        id: id,
                        user_id: currentUserId, // Associate with logged in user if available
                        device_name: deviceName,
                        last_active: new Date().toISOString()
                    }, { onConflict: 'id' });

                if (error) {
                    console.error('Error registering device:', error.message || error);
                }
            } catch (err: any) {
                console.error('Failed to register device:', err.message || err);
            }
        };

        registerDevice();
        
        // Update last_active every minute
        const interval = setInterval(registerDevice, 60000);
        return () => clearInterval(interval);
    }, [currentUserId]);

    return deviceId;
};
