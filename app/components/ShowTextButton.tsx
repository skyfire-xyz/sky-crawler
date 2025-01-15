import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import { Highlight, themes } from "prism-react-renderer";

interface ShowTextButtonProps {
  text: string;
  filePath: string;
}

const ShowTextButton: React.FC<ShowTextButtonProps> = ({ text, filePath }) => {
  const [open, setOpen] = useState(false);

  const decodeHtml = (html: string) => {
    const txt = document.createElement('textarea');
    txt.innerHTML = html;
    return txt.value;
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        Show Data
      </Button>
      
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[80vw] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{filePath}</DialogTitle>
          </DialogHeader>
          
          <div className="rounded-md overflow-hidden">
            <Highlight
              theme={themes.vsCodeDark}
              code={decodeHtml(text)}
              language="typescript"
            >
              {({ className, style, tokens, getLineProps, getTokenProps }) => (
                <pre className={`${className} text-xs p-4 overflow-y-auto`} style={{ ...style, fontSize: '0.875rem', lineHeight: '1.25rem' }}>
                  {tokens.map((line, i) => (
                    <div key={i} {...getLineProps({ line })}>
                      {line.map((token, key) => (
                        <span key={key} {...getTokenProps({ token })} />
                      ))}
                    </div>
                  ))}
                </pre>
              )}
            </Highlight>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ShowTextButton;
