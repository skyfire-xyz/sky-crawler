import React from "react";
import { Button } from "flowbite-react";

interface ShowTextButtonProps {
  text: string;
  filePath: string;
}

const ShowTextButton: React.FC<ShowTextButtonProps> = ({ text, filePath }) => {
  const handleClick = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head>
            <title>${filePath}</title>
            <style>
              pre {
                white-space: pre-wrap;       /* CSS3 */
                white-space: -moz-pre-wrap;  /* Firefox */
                white-space: -pre-wrap;      /* Opera <7 */
                white-space: -o-pre-wrap;    /* Opera 7 */
                word-wrap: break-word;       /* IE */
              }
            </style>
          </head>
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
