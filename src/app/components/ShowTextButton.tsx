import React from "react";
import { Button } from "flowbite-react";

interface ShowTextButtonProps {
  text: string;
}

const ShowTextButton: React.FC<ShowTextButtonProps> = ({ text }) => {
  const handleClick = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
            <html>
              <head><title>Full Message</title></head>
              <body>
                <pre>${text}</pre>
              </body>
            </html>
          `);
      newWindow.document.close();
    }
  };

  return (
    <Button onClick={handleClick} size="xs">
      Show Data
    </Button>
  );
};

export default ShowTextButton;
