import React from 'react';
import { MdArrowBack } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const PrivacyPolicy = () => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (window.history.length > 1 && window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else {
            navigate('/profile');
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div onClick={handleBack} style={styles.backButton}>
                    <MdArrowBack size={24} color="#333" />
                </div>
                <h1 style={styles.title}>Privacy Policy</h1>
            </div>
            <div style={styles.content}>
                <h1 style={styles.mainTitle}>Realto Privacy Policy</h1>
                <p style={styles.subtitle}>
                    (Aligned with India’s Digital Personal Data Protection Act, 2023)
                </p>
                <p style={styles.paragraph}>
                    <strong>Last Updated:</strong> December 13, 2025
                </p>
                <p style={styles.paragraph}>
                    Realto (“we”, “our”, “us”) values your privacy and is committed to protecting your personal and property-related data. This Privacy Policy explains how we collect, use, store, and protect your data in compliance with the <strong>Digital Personal Data Protection Act, 2023 (DPDP Act)</strong>.
                </p>
                <p style={styles.paragraph}>
                    By using Realto’s website or application (“Platform”), you consent to the practices described in this policy.
                </p>

                <hr style={styles.divider} />

                <h2 style={styles.sectionTitle}>1. Data We Collect</h2>

                <h3 style={styles.subSectionTitle}>a) Personal Data</h3>
                <ul style={styles.list}>
                    <li>Name</li>
                    <li>Mobile number</li>
                    <li>Email address</li>
                    <li>Account login details</li>
                </ul>

                <h3 style={styles.subSectionTitle}>b) Property Data</h3>
                <ul style={styles.list}>
                    <li>Property address, type, size</li>
                    <li>Images and descriptions uploaded by you</li>
                    <li>Pricing or availability details</li>
                </ul>

                <h3 style={styles.subSectionTitle}>c) Technical Data</h3>
                <ul style={styles.list}>
                    <li>IP address</li>
                    <li>Device and browser information</li>
                    <li>Platform usage data</li>
                </ul>

                <hr style={styles.divider} />

                <h2 style={styles.sectionTitle}>2. Purpose of Data Collection</h2>
                <p style={styles.paragraph}>
                    Your data is collected <strong>only for lawful and specific purposes</strong>, including:
                </p>
                <ul style={styles.list}>
                    <li>Providing Realto’s services</li>
                    <li>Displaying your property listing on Realto</li>
                    <li>Improving platform performance</li>
                    <li>Communicating service-related updates</li>
                    <li>Ensuring security and fraud prevention</li>
                    <li>Compliance with applicable laws</li>
                </ul>

                <hr style={styles.divider} />

                <h2 style={styles.sectionTitle}>3. 🚫 No Sharing of Property or Personal Data</h2>
                <h3 style={styles.subSectionTitle}>Realto does NOT share, sell, rent, or disclose your personal or property information to any third party.</h3>
                <p style={styles.paragraph}>This includes:</p>
                <ul style={styles.list}>
                    <li>❌ No brokers</li>
                    <li>❌ No advertisers</li>
                    <li>❌ No marketing agencies</li>
                    <li>❌ No external platforms</li>
                </ul>
                <p style={styles.paragraph}>
                    Your property data remains <strong>strictly within the Realto platform</strong> and under your control.
                </p>

                <h3 style={styles.subSectionTitle}>Legal Exception</h3>
                <p style={styles.paragraph}>
                    Data may be disclosed <strong>only if required by law</strong>, court order, or government authority, as mandated under the DPDP Act.
                </p>

                <hr style={styles.divider} />

                <h2 style={styles.sectionTitle}>4. Data Storage & Security</h2>
                <p style={styles.paragraph}>
                    We use reasonable technical and organizational safeguards to protect your data from:
                </p>
                <ul style={styles.list}>
                    <li>Unauthorized access</li>
                    <li>Loss or misuse</li>
                    <li>Disclosure or alteration</li>
                </ul>
                <p style={styles.paragraph}>
                    While we take strong measures, no digital system is completely secure.
                </p>

                <hr style={styles.divider} />

                <h2 style={styles.sectionTitle}>5. Data Retention</h2>
                <p style={styles.paragraph}>We retain your data:</p>
                <ul style={styles.list}>
                    <li>Only for as long as necessary to provide services</li>
                    <li>Or as required under applicable law</li>
                </ul>
                <p style={styles.paragraph}>
                    You may request deletion of your data at any time.
                </p>

                <hr style={styles.divider} />

                <h2 style={styles.sectionTitle}>6. User Rights (DPDP Act Compliance)</h2>
                <p style={styles.paragraph}>
                    As a user (Data Principal), you have the right to:
                </p>
                <ul style={styles.list}>
                    <li>Access your personal data</li>
                    <li>Request correction or update</li>
                    <li>Request deletion</li>
                    <li>Withdraw consent</li>
                    <li>File a grievance</li>
                </ul>

                <hr style={styles.divider} />

                <h2 style={styles.sectionTitle}>7. Consent Withdrawal</h2>
                <p style={styles.paragraph}>
                    You may withdraw consent by contacting us. Upon withdrawal, we will stop processing your data unless retention is required by law.
                </p>

                <hr style={styles.divider} />

                <h2 style={styles.sectionTitle}>8. Cookies</h2>
                <p style={styles.paragraph}>
                    Realto uses cookies <strong>only for functional and analytical purposes</strong>.
                    We do <strong>not</strong> use cookies for third-party data sharing or selling.
                </p>

                <hr style={styles.divider} />

                <h2 style={styles.sectionTitle}>9. Grievance Redressal</h2>
                <p style={styles.paragraph}>As required under the DPDP Act:</p>
                <p style={styles.paragraph}>
                    📧 <strong>Email:</strong> <a href="mailto:support@realto.in" style={styles.link}>support@realto.in</a><br />
                    👤 <strong>Grievance Officer:</strong> [Name]<br />
                    ⏱ <strong>Response Time:</strong> Within 7 working days
                </p>

                <hr style={styles.divider} />

                <h2 style={styles.sectionTitle}>10. Policy Updates</h2>
                <p style={styles.paragraph}>
                    This Privacy Policy may be updated periodically. Continued use of Realto indicates acceptance of the updated policy.
                </p>
            </div>
        </div>
    );
};

const styles = {
    container: {
        flex: 1,
        backgroundColor: "#ffffff",
        height: '100%',
        overflowY: 'auto',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        padding: '15px 20px',
        borderBottom: '1px solid #f0f0f0',
        backgroundColor: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 10,
    },
    backButton: {
        cursor: 'pointer',
        marginRight: '15px',
        display: 'flex',
        alignItems: 'center',
    },
    title: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#333',
        margin: 0,
    },
    content: {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        paddingBottom: '50px',
    },
    mainTitle: {
        fontSize: '24px',
        fontWeight: '700',
        color: '#333',
        marginBottom: '5px',
    },
    subtitle: {
        fontSize: '14px',
        color: '#666',
        fontStyle: 'italic',
        marginBottom: '20px',
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#333',
        marginTop: '25px',
        marginBottom: '15px',
    },
    subSectionTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#444',
        marginTop: '15px',
        marginBottom: '10px',
    },
    paragraph: {
        fontSize: '16px',
        lineHeight: '1.6',
        color: '#555',
        marginBottom: '15px',
    },
    list: {
        listStyleType: 'disc',
        paddingLeft: '25px',
        marginBottom: '15px',
        color: '#555',
        fontSize: '16px',
        lineHeight: '1.6',
    },
    divider: {
        border: '0',
        borderTop: '1px solid #eee',
        margin: '30px 0',
    },
    link: {
        color: '#2196F3',
        textDecoration: 'none',
    }
};

export default PrivacyPolicy;
