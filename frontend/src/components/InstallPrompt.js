import React, { useEffect, useState } from 'react';
import { Button } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

const InstallPrompt = ({ mobile }) => {
    const [deferredPrompt, setDeferredPrompt] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            // Stash the event so it can be triggered later.
            setDeferredPrompt(e);
            // Update UI notify the user they can install the PWA
            setIsVisible(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        };
    }, []);

    const handleInstallClick = async () => {
        if (!deferredPrompt) return;

        // Show the install prompt
        deferredPrompt.prompt();
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        // We've used the prompt, and can't use it again, discard it
        setDeferredPrompt(null);
        setIsVisible(false);
    };

    if (!isVisible) return null;

    if (mobile) {
        return (
            <Button
                type="primary"
                block
                icon={<DownloadOutlined />}
                onClick={handleInstallClick}
                style={{ marginTop: '10px', backgroundColor: '#e53935' }}
            >
                Install App
            </Button>
        )
    }

    return (
        <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={handleInstallClick}
            title="Install App"
            style={{ backgroundColor: '#e53935', borderColor: '#e53935' }}
        >
            Install
        </Button>
    );
};

export default InstallPrompt;
