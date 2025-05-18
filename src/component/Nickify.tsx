import './Nickify.css'
import { useEditor, EditorContent } from "@tiptap/react";
import { useState } from "react";

import StarterKit from "@tiptap/starter-kit";
import Document from "@tiptap/extension-document";
import Heading from "@tiptap/extension-heading";
import Paragraph from "@tiptap/extension-paragraph";
import Text from "@tiptap/extension-text";
import TextAlign from "@tiptap/extension-text-align";
import Blockquote from "@tiptap/extension-blockquote";
import BulletList from "@tiptap/extension-bullet-list";
import ListItem from "@tiptap/extension-list-item";
import CodeBlock from "@tiptap/extension-code-block";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import OrderedList from "@tiptap/extension-ordered-list";
import Table from "@tiptap/extension-table";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import TableRow from "@tiptap/extension-table-row";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Dropcursor from "@tiptap/extension-dropcursor";

import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";

import Highlight from "@tiptap/extension-highlight";
import css from "highlight.js/lib/languages/css";
import js from "highlight.js/lib/languages/javascript";
import ts from "highlight.js/lib/languages/typescript";
import html from "highlight.js/lib/languages/xml";
import NickifyToolbar from "./NickifyToolbar";


const lowlight = createLowlight(common);

lowlight.register("html", html);
lowlight.register("css", css);
lowlight.register("js", js);
lowlight.register("ts", ts);
type TextEditorProps = {
    initialContent?: string;
    isAiEnabled?: boolean;
    setContent: React.Dispatch<React.SetStateAction<string>>;
};



const Nickify = ({ initialContent = '', isAiEnabled = false, setContent }: TextEditorProps) => {
    const [show, setShow] = useState<Boolean>(false);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Document,
            Paragraph,
            Text,
            Heading,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Blockquote,
            BulletList,
            ListItem,
            Heading.configure({
                levels: [1, 2, 3, 4, 5, 6],
            }),
            CodeBlock,
            HorizontalRule,
            OrderedList,
            Table.configure({
                resizable: true,
            }),
            TableRow,
            TableHeader,
            TableCell,
            Bold,
            Italic,
            Underline,
            Strike,
            Subscript,
            Superscript,
            Highlight.configure({ multicolor: true }),
            CodeBlockLowlight.configure({
                lowlight,
            }),
            Link.configure({
                openOnClick: false,
                autolink: true,
                defaultProtocol: "https",
                protocols: ["http", "https"],
                isAllowedUri: (url, ctx) => {
                    try {
                        // construct URL
                        const parsedUrl = url.includes(":")
                            ? new URL(url)
                            : new URL(`${ctx.defaultProtocol}://${url}`);

                        // use default validation
                        if (!ctx.defaultValidate(parsedUrl.href)) {
                            return false;
                        }

                        // disallowed protocols
                        const disallowedProtocols = ["ftp", "file", "mailto"];
                        const protocol = parsedUrl.protocol.replace(":", "");

                        if (disallowedProtocols.includes(protocol)) {
                            return false;
                        }

                        // only allow protocols specified in ctx.protocols
                        const allowedProtocols = ctx.protocols.map((p) =>
                            typeof p === "string" ? p : p.scheme,
                        );

                        if (!allowedProtocols.includes(protocol)) {
                            return false;
                        }

                        // disallowed domains
                        const disallowedDomains = [
                            "example-phishing.com",
                            "malicious-site.net",
                        ];
                        const domain = parsedUrl.hostname;

                        if (disallowedDomains.includes(domain)) {
                            return false;
                        }

                        // all checks have passed
                        return true;
                    } catch {
                        return false;
                    }
                },
                shouldAutoLink: (url) => {
                    try {
                        // construct URL
                        const parsedUrl = url.includes(":")
                            ? new URL(url)
                            : new URL(`https://${url}`);

                        // only auto-link if the domain is not in the disallowed list
                        const disallowedDomains = [
                            "example-no-autolink.com",
                            "another-no-autolink.com",
                        ];
                        const domain = parsedUrl.hostname;

                        return !disallowedDomains.includes(domain);
                    } catch {
                        return false;
                    }
                },
            }),
            Image,
            Dropcursor,
        ],
        content: initialContent,
        onUpdate: ({ editor }) => {
            setContent(editor.getHTML());
        },
        editorProps: {
            handleKeyDown(view, event) {
                const isCtrlOrCmd = event.metaKey || event.ctrlKey;
                if (event.key === "ArrowDown" && isCtrlOrCmd) {
                    setShow(!show);
                    return true;
                } 
                else {
                    setShow(false);
                }
                return false; // this makes tiptap handle other keys
            },
        },
    });

    if (!editor) {
        return <p>Loading editor...</p>;
    }
    return <>
        <EditorContent
            editor={editor}
            style={{
                border: "1px solid #d1d5db", // border-gray-300
                margin: "1rem",               // m-4
              }}
        />
       
        {show && <NickifyToolbar editor={editor} isAiEnabled={isAiEnabled} />}

    </>;
};
export default Nickify;
