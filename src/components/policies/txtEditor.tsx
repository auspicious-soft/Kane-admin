"use client";
import { Editor } from '@tinymce/tinymce-react';
import React, { useRef, useState, useEffect } from 'react';
import { Editor as TinyMCEEditor } from 'tinymce';

interface TextEditorProps {
  value?: string;
  setDescription: (content: string) => void;
}

const TextEditor = ({ value = "", setDescription }: TextEditorProps) => {
  const [isClient, setIsClient] = useState(false);
  const editorRef = useRef<TinyMCEEditor | null>(null);

  // Client-side rendering check
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Simple direct handler for editor changes
  const handleEditorChange = (content: string) => {
    setDescription(content);
  };

  if (!isClient) {
    return null;
  }

  return (
    <Editor
      apiKey="bfiif5l897h0tnz5633ntzuzxtnccbq360798pls2ilxjs0o"
      value={value}
      onInit={(evt, editor) => {
        editorRef.current = editor;
      }}
      init={{
        height: 300,
        menubar: false,
        statusbar: false,
        plugins: 'table', // Add the table plugin
        toolbar: 'fontfamily fontsizeinput blocks forecolor bold italic underline alignleft aligncenter alignright undo redo | table', // Add table to toolbar
        toolbar_location: 'top',
        content_css: 'default',
        font_family_formats:
          'Normal=arial,helvetica,sans-serif;' +
          'Sans Serif=sans-serif;' +
          'Serif=serif;' +
          'Monospace=monospace',
        content_style: `
          body { 
            font-family: arial,helvetica,sans-serif;
            font-size: 14px;
            margin: 0;
            padding: 16px;
          }
          table {
            border-collapse: collapse;
            width: 100%;
          }
          th, td {
            border: 1px solid #ddd;
            padding: 8px;
          }
          th {
            background-color: #f2f2f2;
          }
        `,
        browser_spellcheck: true,
      }}
      onEditorChange={handleEditorChange}
    />
  );
};

export default TextEditor;