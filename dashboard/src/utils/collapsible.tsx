import React from 'react';

interface CollapsibleProps {
  title: string;
  fullMessage: string;
}

const Collapsible: React.FC<CollapsibleProps> = ({ title, fullMessage }) => {
  const openInNewTab = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>Full Message</title></head>
          <body>
            <pre>${fullMessage}</pre>
          </body>
        </html>
      `);
      newWindow.document.close();
    }
  };

  return (
    <div>
      <p>{title}</p>
      <button onClick={openInNewTab}>View Full Message</button>
    </div>
  );
};

export default Collapsible;
