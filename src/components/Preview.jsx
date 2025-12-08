import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Navbar from './Navbar';
import './Preview.css';
import {
    formatBibliographyMLA,
    formatBibliographyAPA,
    formatBibliographyChicago,
    formatBibliographyHarvard,
    formatBibliographyVancouver
} from '../utils/citationFormatter';
import {auth} from "../firebase.js";

function Preview() {
    const location = useLocation();
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    // Get data passed from Home page
    const { bibs, format } = location.state || { bibs: [], format: 'MLA' };

    // Test the formatter
    console.log('=== PREVIEW PAGE ===');
    console.log('Format:', format);
    console.log('Bibs received:', bibs);

    // Format the bibliography
    // Format the bibliography based on selected format
    const getFormattedCitations = () => {
        switch (format) {
            case 'MLA':
                return formatBibliographyMLA(bibs);
            case 'APA':
                return formatBibliographyAPA(bibs);
            case 'Chicago':
                return formatBibliographyChicago(bibs);
            case 'Harvard':
                return formatBibliographyHarvard(bibs);
            case 'Vancouver':
                return formatBibliographyVancouver(bibs);
            default:
                return formatBibliographyMLA(bibs);
        }
    };

    const formattedCitations = getFormattedCitations();
    console.log('\n=== FORMATTED CITATIONS (MLA) ===');
    formattedCitations.forEach((citation, index) => {
        console.log(`[${index + 1}] ${citation}`);
    });
    console.log('==================================\n');

    // Generate HTML code string
    const generateHTMLCode = () => {
        const htmlCode = formattedCitations
            .map(citation => `<div class="citation">${citation}</div>`)
            .join('\n');

        return htmlCode;
    };

    // Copy to clipboard handler
    const handleCopyCode = () => {
        const code = generateHTMLCode();
        navigator.clipboard.writeText(code);
        setCopied(true);

        // Reset "Copied!" message after 2 seconds
        setTimeout(() => {
            setCopied(false);
        }, 2000);

        console.log('✓ HTML code copied to clipboard!');
    };

    return (
        <>
            <Navbar isLoggedIn={auth.currentUser === null} />

            <div className="preview-container">
                <div className="preview-content">
                    <h1>Preview - {format} Format</h1>

                    {/* For now, just display raw data */}
                    <div className="preview-card">
                        <h3>Bibliography ({bibs.length} entries)</h3>

                        <div className="formatted-bibliography">
                            {formattedCitations.map((citation, index) => (
                                <div
                                    key={bibs[index].id}
                                    className="citation-entry"
                                    dangerouslySetInnerHTML={{ __html: citation }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* HTML Code Section */}
                    <div className="html-code-section">
                        <h3>HTML Code</h3>
                        <p className="code-description">Copy this code and paste it into your HTML file</p>

                        <textarea
                            className="html-code-textarea"
                            value={generateHTMLCode()}
                            readOnly
                            rows={10}
                        />

                        <button onClick={handleCopyCode} className="copy-btn">
                            {copied ? '✓ Copied!' : 'Copy to Clipboard'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Preview;