import './Nickify.css'
import { useEditor, EditorContent } from "@tiptap/react";
import { useEffect, useState } from "react";

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
import DOMPurify from 'dompurify';
import { useRef } from 'react';
import { Plugin } from 'prosemirror-state';
import { Extension } from '@tiptap/core';

const useDebouncedShow = (rawShow: boolean, forceShow: boolean) => {
    const [debouncedShow, setDebouncedShow] = useState(false);

    useEffect(() => {
        if (forceShow || rawShow) {
            setDebouncedShow(true);
        } else {
            const timeout = setTimeout(() => {
                setDebouncedShow(false);
            }, 150); // tolerate brief selection loss
            return () => clearTimeout(timeout);
        }
    }, [rawShow, forceShow]);

    return debouncedShow;
};

export function ForceShowExtension(
    setRawShow: (value: boolean) => void,
    forceShowRef: React.MutableRefObject<boolean>
) {
    return Extension.create({
        name: 'forceShow',

        addProseMirrorPlugins(): Plugin[] {
            return [
                new Plugin({
                    props: {
                        handleKeyDown(view, event) {
                            if ((event.ctrlKey || event.metaKey) && event.key === 'ArrowDown') {
                                forceShowRef.current = true;
                                setRawShow(true);
                                setTimeout(() => {
                                    forceShowRef.current = false;
                                }, 200);
                                return true;
                            }
                            return false;
                        },
                        handleDOMEvents: {
                            keyup(view) {
                                if (forceShowRef.current) return false;
                                const isTextSelected = !view.state.selection.empty;
                                setRawShow(isTextSelected);
                                return false;
                            },
                            mouseup(view) {
                                if (forceShowRef.current) return false;
                                const isTextSelected = !view.state.selection.empty;
                                setRawShow(isTextSelected);
                                return false;
                            },
                        },
                    },
                }),
            ];
        },
    });
}

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

// DOMPurify configuration for rich text editor
const sanitizerConfig = {
    ALLOWED_TAGS: [
        'p', 'br', 'strong', 'em', 'u', 's', 'sub', 'sup',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'ul', 'ol', 'li',
        'blockquote', 'pre', 'code',
        'a', 'img',
        'table', 'thead', 'tbody', 'tr', 'th', 'td',
        'div', 'span'
    ],

    // Allowed attributes
    ALLOWED_ATTR: [
        'href', 'target', 'rel',
        'src', 'alt', 'width', 'height',
        'class', 'style',
        'colspan', 'rowspan'
    ],

    // Remove unsafe elements
    FORBID_TAGS: ['script', 'object', 'embed', 'form', 'input', 'button', 'textarea', 'select', 'option'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit'],

    // Additional security options
    SANITIZE_DOM: true,
    KEEP_CONTENT: true
};

// Multi-layer sanitization function
const sanitizeHTML = (htmlContent: string): string => {
    if (!htmlContent || typeof htmlContent !== 'string') {
        return '';
    }

    // Layer 1: DOMPurify sanitization
    let sanitizedContent = DOMPurify.sanitize(htmlContent, sanitizerConfig);

    // Layer 2: Custom sanitization for additional threats
    sanitizedContent = customSanitization(sanitizedContent);

    return sanitizedContent;
};


// Custom sanitization layer
const customSanitization = (content: string): string => {
    return content
        // Remove any remaining script-like content
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')

        // Remove javascript: protocols
        .replace(/javascript:/gi, 'removed:')

        // Remove vbscript: protocols  
        .replace(/vbscript:/gi, 'removed:')

        // Remove data: URIs except for images
        .replace(/data:(?!image\/)[^;,]*[;,]/gi, 'removed:')

        // Remove expression() CSS
        .replace(/expression\s*\(/gi, 'removed(')

        // Remove @import in CSS
        .replace(/@import/gi, 'removed')

        // Remove behavior CSS property
        .replace(/behavior\s*:/gi, 'removed:')

        // Remove -moz-binding CSS
        .replace(/-moz-binding/gi, 'removed')

        // Remove any remaining event handlers
        .replace(/\bon\w+\s*=/gi, 'data-removed=')

        // Remove style attributes with potentially dangerous content
        .replace(/style\s*=\s*["'][^"']*(?:expression|javascript|vbscript|data:|@import)[^"']*["']/gi, '');
};

// Malicious pattern detection
const detectMaliciousPatterns = (content: string): string[] => {
    const suspiciousPatterns = [
        { pattern: /javascript:/gi, name: 'JavaScript Protocol' },
        { pattern: /vbscript:/gi, name: 'VBScript Protocol' },
        { pattern: /data:text\/html/gi, name: 'HTML Data URI' },
        { pattern: /data:application/gi, name: 'Application Data URI' },
        { pattern: /<script/gi, name: 'Script Tag' },
        { pattern: /expression\s*\(/gi, name: 'CSS Expression' },
        { pattern: /behavior\s*:/gi, name: 'CSS Behavior' },
        { pattern: /-moz-binding/gi, name: 'Mozilla Binding' },
        { pattern: /@import/gi, name: 'CSS Import' },
        { pattern: /\\u00/gi, name: 'Unicode Escape' },
        { pattern: /&#x/gi, name: 'Hex Entity' },
        { pattern: /on\w+\s*=/gi, name: 'Event Handler' }
    ];

    const detectedPatterns: string[] = [];

    suspiciousPatterns.forEach(({ pattern, name }) => {
        if (pattern.test(content)) {
            detectedPatterns.push(name);
        }
    });

    return detectedPatterns;
};

const Nickify = ({ initialContent = '', isAiEnabled = false, setContent }: TextEditorProps) => {
    const forceShow = useRef(false);
    const [rawShow, setRawShow] = useState(false);
    const show = useDebouncedShow(rawShow, forceShow.current);

    const editor = useEditor({
        extensions: [
            ForceShowExtension(setRawShow, forceShow),
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
            if (forceShow.current) return;
            const isTextSelected = !editor.state.selection.empty;
            setRawShow(isTextSelected);
            const rawContent = editor.getHTML();
            const maliciousPatterns = detectMaliciousPatterns(rawContent);
            if (maliciousPatterns.length > 0) {
                console.warn('Malicious patterns detected:', maliciousPatterns);
            }
            const sanitizedContent = sanitizeHTML(rawContent);
            setContent(sanitizedContent);
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
