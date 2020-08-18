import React from 'react';
import './Terms.css';
 
class Nav extends React.Component {
    render() {
        return (<div className="terms">
            <h1>Terms of service</h1>
            <h2>Account</h2>
            <p>You are responsible for maintaining the confidentiality of all your passwords and are responsible for all use of your account. It is therefore critical that you do not share your 
                account information with anyone.</p>
            <h2>Acceptable use policy</h2>
            <p>Your use of the Services must not violate any applicable laws, including copyright or trademark laws, export control laws, or other laws in your jurisdiction. You are responsible 
                for making sure that your use of the Services is in compliance with laws and any applicable regulations.</p>
            <p>You agree that you will not under any circumstances upload, post, or transmit any content that:</p>
            <ul>
                <li>is unlawful or promotes unlawful activities;</li>
                <li>is or contains sexually obscene content;</li>
                <li>is libelous, defamatory, or fraudulent;</li>
                <li>is discriminatory or abusive toward any individual or group;</li>
                <li>contains or installs any active malware or exploits, or uses our platform for exploit delivery (such as part of a command and control system); or</li>
                <li>infringes on any proprietary right of any party, including patent, trademark, trade secret, copyright, right of publicity, or other rights.</li>
            </ul>
            <p>While using our Services, you agree that you will not under any circumstances:</p>
            <ul>
                <li>harass, abuse, threaten, or incite violence towards any individual or group;</li>
                <li>use our servers for any form of excessive automated bulk activity (for example, spamming), or relay any other form of unsolicited advertising or solicitation through our 
                    servers, such as get-rich-quick schemes;</li>
                <li>attempt to disrupt or tamper with EvaluatePsychologists' servers in ways that could harm our Website or Service, to place undue burden on our servers through automated means, or 
                    to access EvaluatePsychologists' Service in ways that exceed your authorization;</li>
                <li>impersonate any person or entity, including through false association with us, or by fraudulently misrepresenting your 
                    identity or website’s purpose; or</li>
                <li>violate the privacy of any third party, such as by posting another person’s personal information without consent.</li>
            </ul>
            <h2>Services usage limits</h2>
            <p>You agree not to reproduce, duplicate, copy, sell, resell or exploit any portion of the Service, use of the Service, or access to the Service without our express written 
                permission.</p>
            <h2>Violations of this Acceptable Use Policy</h2>
            <p>In addition to any other remedies that may be available to us, we reserve the right to immediately suspend or terminate your account or your access to the Services upon notice 
                and without liability for us should you fail to abide by this Acceptable Use Policy. </p>
            <h2>Site Terms of Use Modifications</h2>
            <p>We may revise these Terms of Use for its Website at any time without prior notice. By using this Website, you are agreeing to be bound by the current version of 
                these Terms and Conditions of Use.</p>
        </div>);
    }
}

export default Nav;