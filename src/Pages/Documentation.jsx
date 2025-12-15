import { useEffect } from 'react';
import Navbar from '../Components/NavBar';
import Footer from '../Components/Footer';

export default function Documentation() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Navbar />
      <div className="w-full h-screen flex flex-col">
        <iframe style={{flex: 1, width: '100%', border: 'none', height: "screen"}} src="https://dlitdp-my.sharepoint.com/personal/miroshnychenko_t_dlit_dp_ua/_layouts/15/Doc.aspx?sourcedoc={fd67b3c0-c28f-43ee-af94-26fb7de65beb}&amp;action=embedview&amp;wdStartOn=1" frameborder="0">Це вбудований документ <a target="_blank" href="https://office.com">Microsoft Office</a> на платформі <a target="_blank" href="https://office.com/webapps">Office</a>.</iframe>
      </div>
      <Footer />
    </>
  );
}
