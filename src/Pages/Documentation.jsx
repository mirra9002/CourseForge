import { useEffect } from 'react';
import Navbar from '../Components/NavBar';
import Footer from '../Components/Footer';

export default function Documentation() {
    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-1 flex w-full">
                <iframe
                    className="flex-1 w-full border-none"
                    src="https://dlitdp-my.sharepoint.com/personal/miroshnychenko_t_dlit_dp_ua/_layouts/15/Doc.aspx?sourcedoc={fd67b3c0-c28f-43ee-af94-26fb7de65beb}&amp;action=embedview&amp;wdStartOn=1"
                    title="Documentation"
                />
            </div>

            <Footer />
        </div>
    );
}
