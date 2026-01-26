import React, { useState } from 'react';
import './GoogleAuthModal.css';

const GoogleAuthModal = ({ isOpen, onClose, onSelect }) => {
    const [view, setView] = useState('picker'); // 'picker' or 'other'

    if (!isOpen) return null;

    const mainAccount = {
        name: 'Jimmy Tole',
        email: 'jimmytole1262@gmail.com',
        avatar: 'https://ui-avatars.com/api/?name=Jimmy+Tole&background=random'
    };

    const otherAccounts = [
        { name: 'Alex Johnson', email: 'alex.j@example.com', avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=random' },
        { name: 'Sarah Wilson', email: 's.wilson@premium.com', avatar: 'https://ui-avatars.com/api/?name=Sarah+Wilson&background=random' }
    ];

    const handleSelect = (account) => {
        onSelect(account);
        onClose();
    };

    return (
        <div className="google-modal-overlay" onClick={onClose}>
            <div className="google-modal-card" onClick={e => e.stopPropagation()}>
                <div className="google-modal-header">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" alt="Google" className="google-logo" />
                    <h1>Sign in to Plana</h1>
                    <p>with google.com</p>
                </div>

                {view === 'picker' ? (
                    <div className="google-view">
                        <p className="view-title">Choose an account to continue</p>

                        <div className="account-list">
                            <div className="account-item" onClick={() => handleSelect(mainAccount)}>
                                <img src={mainAccount.avatar} alt="" className="account-avatar" />
                                <div className="account-info">
                                    <span className="account-name">{mainAccount.name}</span>
                                    <span className="account-email">{mainAccount.email}</span>
                                </div>
                                <div className="account-arrow">›</div>
                            </div>

                            <div className="account-item other-option" onClick={() => setView('other')}>
                                <div className="account-avatar-placeholder">👤</div>
                                <div className="account-info">
                                    <span className="account-name">Use a different account</span>
                                </div>
                            </div>
                        </div>

                        <div className="google-modal-footer">
                            <p>To continue, Google will share your name, email address, language preference, and profile picture with Plana.</p>
                        </div>
                    </div>
                ) : (
                    <div className="google-view">
                        <p className="view-title">Select another account</p>

                        <div className="account-list">
                            {otherAccounts.map((account, idx) => (
                                <div key={idx} className="account-item" onClick={() => handleSelect(account)}>
                                    <img src={account.avatar} alt="" className="account-avatar" />
                                    <div className="account-info">
                                        <span className="account-name">{account.name}</span>
                                        <span className="account-email">{account.email}</span>
                                    </div>
                                </div>
                            ))}
                            <div className="account-item back-option" onClick={() => setView('picker')}>
                                <div className="account-avatar-placeholder">←</div>
                                <div className="account-info">
                                    <span className="account-name">Back to main</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="google-modal-actions">
                    <button className="google-cancel-btn" onClick={onClose}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default GoogleAuthModal;
