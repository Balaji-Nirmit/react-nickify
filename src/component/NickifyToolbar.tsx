import { useCallback, useRef, useState, useEffect } from "react";
import { Editor } from "@tiptap/react";
import {
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Code,
    Heading1,
    Heading2,
    Heading3,
    Heading4,
    Heading5,
    Heading6,
    List,
    ListOrdered,
    Quote,
    Subscript,
    Superscript,
    AlignLeft,
    AlignCenter,
    AlignRight,
    Link,
    Unlink,
    Table,
    Table2,
    Columns3,
    AlignJustify,
    Trash,
    Merge,
    TableCellsMerge,
    TableCellsSplit,
    MoveLeft,
    MoveRight,
    Bolt,
    BetweenVerticalStart,
    BetweenVerticalEnd,
    BetweenHorizonalStart,
    BetweenHorizonalEnd,
    TableColumnsSplit,
    TableRowsSplit,
    Rows3,
    Square,
    Image,
    HighlighterIcon,
    XCircle,
} from "lucide-react";
import { GoogleGenAI } from "@google/genai/web";


type ToolbarButtonProps = {
    onClick: () => void;
    icon: React.ElementType;
    label: string;
    show?: boolean;
    isActive?: boolean;
    color?: any;
};

type NickifyToolbarProps = {
    editor: Editor;
    isAiEnabled: boolean;
};

interface ModelProps {
    setOpen: React.Dispatch<React.SetStateAction<boolean>> // ✅ CORRECT
    generateResponse: (question: String) => void; // a simple method with no arguments
}

const Loader = () => {
    return (
        <>
            <div
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                    width: "100%",
                }}
            >
                <div
                    style={{
                        height: "3rem",             // h-12 = 48px
                        width: "3rem",              // w-12 = 48px
                        borderRadius: "9999px",     // rounded-full
                        borderWidth: "4px",         // border-4
                        borderStyle: "solid",
                        borderColor: "#3b82f6",     // border-blue-500
                        borderTopColor: "transparent", // border-t-transparent
                        animation: "spin 1s linear infinite", // animate-spin
                    }}
                />
            </div>

        </>
    )
}

const ToolbarButton: React.FC<ToolbarButtonProps> = ({
    onClick,
    icon: Icon,
    label,
    show = true,
    isActive = false,
    color = null,
}) => {
    if (!show) return null;
    const [showTooltip, setShowTooltip] = useState<boolean>(false);
    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            style={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "0.25rem",
                borderRadius: "0.5rem",
                cursor: "pointer",
                backgroundColor: showTooltip ? "#e5e7eb" : "transparent", // hover:bg-gray-200
                transition: "background-color 0.2s ease-in-out",
            }}
        >
            <button
                type="button"
                style={{
                    padding: "0.5rem",
                    borderRadius: "0.375rem",
                    border: "1px solid",
                    borderColor: isActive ? "#9ca3af" : "#d1d5db", // gray-400 or gray-300
                    backgroundColor: isActive ? "#e5e7eb" : "#ffffff", // bg-gray-200 or bg-white
                    transition: "background-color 0.15s ease-in-out",
                }}
            >
                <Icon
                    style={{
                        width: "1.25rem",  // w-5
                        height: "1.25rem", // h-5
                        color: color || "#1f2937", // text-[color] or gray-800
                    }}
                />
            </button>

            {label}

            {/* Tooltip */}
            {showTooltip && (
                <div
                    style={{
                        position: "absolute",
                        bottom: "100%",
                        marginBottom: "0.25rem", // mb-1
                        left: "50%",
                        transform: "translateX(-50%)",
                        padding: "0.25rem 0.5rem", // px-2 py-1
                        fontSize: "0.875rem", // text-sm
                        backgroundColor: "black",
                        color: "white",
                        borderRadius: "0.25rem", // rounded
                        whiteSpace: "nowrap",
                        zIndex: 10,
                        opacity: 1,
                        transition: "opacity 0.2s ease-in-out",
                    }}
                >
                    {label}
                </div>
            )}
        </div>
    );
};

const Model: React.FC<ModelProps> = ({ setOpen, generateResponse }) => {
    const [question, setQues] = useState<String>('')

    const handleSubmit = () => {
        setOpen(false)
        generateResponse(question)
    }
    return (
        <div
            style={{
                position: "fixed",
                inset: 0,
                backgroundColor: "rgba(0, 0, 0, 0.4)", // bg-black/40
                backdropFilter: "blur(4px)",           // backdrop-blur-sm
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 50,
            }}
        >
            <div
                style={{
                    backgroundColor: "white",
                    width: "100%",
                    maxWidth: "28rem", // max-w-md
                    margin: "0 auto",
                    borderRadius: "1rem", // rounded-2xl = 16px
                    padding: "1.5rem",    // p-6 = 24px
                    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)", // shadow-xl
                    position: "relative",
                    animation: "fadeIn 0.3s ease-in-out", // animate-fade-in (you'll need to define this in keyframes)
                }}
            >
                <button
                    onClick={() => setOpen(false)}
                    style={{
                        position: "absolute",
                        top: "0.75rem",    // top-3 = 12px
                        right: "0.75rem",
                        color: "#9ca3af",  // text-gray-400
                        fontSize: "1.25rem",
                        fontWeight: "bold",
                        cursor: "pointer",
                        transition: "color 0.2s ease-in-out",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = "#4b5563")} // hover:text-gray-600
                    onMouseLeave={(e) => (e.currentTarget.style.color = "#9ca3af")}
                >
                    <XCircle />
                </button>

                <h2
                    style={{
                        fontSize: "1.25rem", // text-xl
                        fontWeight: 600,     // font-semibold
                        color: "#1f2937",    // text-gray-800
                        marginBottom: "1rem", // mb-4
                    }}
                >
                    Ask your question
                </h2>

                <input
                    type="text"
                    onChange={(e) => setQues(e.target.value)}
                    placeholder="Type your question here..."
                    style={{
                        width: "100%",
                        padding: "0.5rem 1rem", // px-4 py-2
                        border: "1px solid #d1d5db", // border-gray-300
                        borderRadius: "0.5rem", // rounded-lg = 8px
                        outline: "none",
                        boxSizing: "border-box",
                    }}
                    onFocus={(e) => (e.target.style.boxShadow = "0 0 0 2px #60a5fa")} // focus:ring-2 focus:ring-blue-400
                    onBlur={(e) => (e.target.style.boxShadow = "none")}
                />

                <button
                    onClick={handleSubmit}
                    style={{
                        marginTop: "1rem", // mt-4
                        width: "100%",
                        backgroundColor: "#3b82f6", // bg-blue-500
                        color: "white",
                        fontWeight: 600,
                        padding: "0.5rem 0", // py-2
                        borderRadius: "0.5rem", // rounded-lg
                        transition: "background-color 0.2s ease-in-out",
                        cursor: "pointer",
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")} // hover:bg-blue-600
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#3b82f6")}
                >
                    Ask
                </button>
            </div>
        </div>
    )
}

const NickifyToolbar: React.FC<NickifyToolbarProps> = ({ editor, isAiEnabled }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const toolbarRef = useRef<HTMLDivElement | null>(null);
    const [floatingPosition, setFloatingPosition] = useState({ top: 0, left: 0 });
    const screenWidth = window.innerWidth;
    const [open, setOpen] = useState<boolean>(false)

    const [loader, setLoader] = useState<boolean>(false)
    const [fetching, setFetching] = useState<boolean>(false)

    const generateResponseByAI = async (question: String) => {
        try {
            if (fetching) return
            if (!isAiEnabled) {
                editor?.commands.insertContent("AI feature not enabled. Configure your GEMINI API KEY");
                return
            }
            setLoader(true)
            setFetching(true)
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY; // for Vite
            const ai = new GoogleGenAI({ apiKey: apiKey });
            const response = await ai.models.generateContent({
                model: "gemini-2.0-flash",
                contents: `${question}.Give answer in formatted html code when needed`,
            });
            if (response.text) {
                editor?.commands.insertContent(response.text);
            } else {
                editor?.commands.insertContent("No response Received");
            }
        } catch {
            editor?.commands.insertContent("No response Received");
        } finally {
            setLoader(false)
            setFetching(false)
        }
    }


    const setLink = useCallback(() => {
        const previousUrl = editor.getAttributes("link").href;
        const url = window.prompt("URL", previousUrl);
        // cancelled
        if (url === null) {
            return;
        }
        // empty
        if (url === "") {
            editor.chain().focus().extendMarkRange("link").unsetLink().run();
            return;
        }
        // update link
        try {
            editor
                .chain()
                .focus()
                .extendMarkRange("link")
                .setLink({ href: url })
                .run();
        } catch (e: any) {
            alert(e.message);
        }
    }, [editor]);

    const toolbarButtons = [
        // Text Formatting
        { label: "Bold", icon: Bold, onClick: () => editor.chain().focus().toggleBold().run(), isActive: () => editor.isActive("bold") },
        { label: "Italic", icon: Italic, onClick: () => editor.chain().focus().toggleItalic().run(), isActive: () => editor.isActive("italic") },
        { label: "Underline", icon: Underline, onClick: () => editor.chain().focus().toggleUnderline().run(), isActive: () => editor.isActive("underline") },
        { label: "Strikethrough", icon: Strikethrough, onClick: () => editor.chain().focus().toggleStrike().run(), isActive: () => editor.isActive("strike") },
        { label: "Code", icon: Code, onClick: () => editor.chain().focus().toggleCodeBlock().run(), isActive: () => editor.isActive("code") },

        //headings
        { label: "Heading1", icon: Heading1, onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(), isActive: () => editor.isActive("heading", { level: 1 }) },
        { label: "Heading2", icon: Heading2, onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(), isActive: () => editor.isActive("heading", { level: 2 }) },
        { label: "Heading3", icon: Heading3, onClick: () => editor.chain().focus().toggleHeading({ level: 3 }).run(), isActive: () => editor.isActive("heading", { level: 3 }) },
        { label: "Heading4", icon: Heading4, onClick: () => editor.chain().focus().toggleHeading({ level: 4 }).run(), isActive: () => editor.isActive("heading", { level: 4 }) },
        { label: "Heading5", icon: Heading5, onClick: () => editor.chain().focus().toggleHeading({ level: 5 }).run(), isActive: () => editor.isActive("heading", { level: 5 }) },
        { label: "Heading6", icon: Heading6, onClick: () => editor.chain().focus().toggleHeading({ level: 6 }).run(), isActive: () => editor.isActive("heading", { level: 6 }) },

        //highlightings
        { label: "Highlight-Orange", icon: HighlighterIcon, onClick: () => editor.chain().focus().toggleHighlight({ color: '#ffc078' }).run(), isActive: () => editor.isActive('highlight', { color: '#ffc078' }), color: '#ffc078' },
        { label: "Highlight-Green", icon: HighlighterIcon, onClick: () => editor.chain().focus().toggleHighlight({ color: '#8ce99a' }).run(), isActive: () => editor.isActive('highlight', { color: '#8ce99a' }), color: '#8ce99a' },
        { label: "Highlight-Blue", icon: HighlighterIcon, onClick: () => editor.chain().focus().toggleHighlight({ color: '#74c0fc' }).run(), isActive: () => editor.isActive('highlight', { color: '#74c0fc' }), color: '#74c0fc' },
        { label: "Highlight-Purple", icon: HighlighterIcon, onClick: () => editor.chain().focus().toggleHighlight({ color: '#b197fc' }).run(), isActive: () => editor.isActive('highlight', { color: '#b197fc' }), color: '#b197fc' },
        { label: "Highlight-LightRed", icon: HighlighterIcon, onClick: () => editor.chain().focus().toggleHighlight({ color: '#ffa8a8' }).run(), isActive: () => editor.isActive('highlight', { color: '#ffa8a8' }), color: '#ffa8a8' },

        // Alignment
        { label: "Left", icon: AlignLeft, onClick: () => editor.chain().focus().setTextAlign("left").run(), isActive: () => editor.isActive({ textAlign: "left" }) },
        { label: "Center", icon: AlignCenter, onClick: () => editor.chain().focus().setTextAlign("center").run(), isActive: () => editor.isActive({ textAlign: "center" }) },
        { label: "Right", icon: AlignRight, onClick: () => editor.chain().focus().setTextAlign("right").run(), isActive: () => editor.isActive({ textAlign: "right" }) },
        { label: "Justify", icon: AlignJustify, onClick: () => editor.chain().focus().setTextAlign("justify").run(), isActive: () => editor.isActive({ textAlign: "justify" }) },

        // Lists & Quotes
        { label: "Bullet List", icon: List, onClick: () => editor.chain().focus().toggleBulletList().run(), isActive: () => editor.isActive("bulletList") },
        { label: "Ordered List", icon: ListOrdered, onClick: () => editor.chain().focus().toggleOrderedList().run(), isActive: () => editor.isActive("orderedList") },
        { label: "Quote", icon: Quote, onClick: () => editor.chain().focus().toggleBlockquote().run(), isActive: () => editor.isActive("blockquote") },
        { label: "Subscript", icon: Subscript, onClick: () => editor.chain().focus().toggleSubscript().run(), isActive: () => editor.isActive("subscript") },
        { label: "Superscript", icon: Superscript, onClick: () => editor.chain().focus().toggleSuperscript().run(), isActive: () => editor.isActive("superscript") },

        // Links
        {
            label: "Link", icon: Link, onClick: () => setLink(), isActive: () => editor.isActive("link")
        },
        { label: "Unlink", icon: Unlink, onClick: () => editor.chain().focus().unsetLink().run(), isActive: () => false },
        { label: "Image", icon: Image, onClick: () => triggerFileSelect(), isActive: () => true },

        // Table Controls
        { label: "Insert Table", icon: Table, onClick: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run(), isActive: () => false },
        { label: "Add column before", icon: BetweenVerticalStart, onClick: () => editor.chain().focus().addColumnBefore().run(), isActive: () => false },
        { label: "Add column after", icon: BetweenVerticalEnd, onClick: () => editor.chain().focus().addColumnAfter().run(), isActive: () => false },
        { label: "Add row before", icon: BetweenHorizonalStart, onClick: () => editor.chain().focus().addRowBefore().run(), isActive: () => false },
        { label: "Add row after", icon: BetweenHorizonalEnd, onClick: () => editor.chain().focus().addRowAfter().run(), isActive: () => false },
        { label: "Delete column", icon: TableColumnsSplit, onClick: () => editor.chain().focus().deleteColumn().run(), isActive: () => false },
        { label: "Delete row", icon: Trash, onClick: () => editor.chain().focus().deleteRow().run(), isActive: () => false },
        { label: "Delete table", icon: TableRowsSplit, onClick: () => editor.chain().focus().deleteTable().run(), isActive: () => false },
        { label: "Merge cells", icon: TableCellsMerge, onClick: () => editor.chain().focus().mergeCells().run(), isActive: () => false },
        { label: "Split cell", icon: TableCellsSplit, onClick: () => editor.chain().focus().splitCell().run(), isActive: () => false },
        { label: "Toggle header column", icon: Columns3, onClick: () => editor.chain().focus().toggleHeaderColumn().run(), isActive: () => false },
        { label: "Toggle header row", icon: Rows3, onClick: () => editor.chain().focus().toggleHeaderRow().run(), isActive: () => false },
        { label: "Toggle header cell", icon: Table2, onClick: () => editor.chain().focus().toggleHeaderCell().run(), isActive: () => false },
        { label: "Merge or split", icon: Merge, onClick: () => editor.chain().focus().mergeOrSplit().run(), isActive: () => false },
        { label: "Set cell attribute", icon: Square, onClick: () => editor.chain().focus().setCellAttribute("colspan", 2).run(), isActive: () => false },
        { label: "Fix tables", icon: Bolt, onClick: () => editor.chain().focus().fixTables().run(), isActive: () => false },
        { label: "Go to next cell", icon: MoveRight, onClick: () => editor.chain().focus().goToNextCell().run(), isActive: () => false },
        { label: "Go to previous cell", icon: MoveLeft, onClick: () => editor.chain().focus().goToPreviousCell().run(), isActive: () => false },

    ];

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleImageUpload = (event: any) => {
        const file = event.target.files?.[0];
        if (!file || !editor) return;

        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result;
            if (typeof base64 === "string") {
                const sanitizedBase64 = base64.replace(/[^\w+/=:;,-]/g, '');
                if (sanitizedBase64.startsWith('data:image/') && sanitizedBase64.includes('base64,')) {
                    editor.chain().focus().setImage({ src: sanitizedBase64 }).run();
                }
            }
        };
        reader.readAsDataURL(file);
    };

    const triggerFileSelect = () => {
        fileInputRef.current?.click();
    };

    if (!editor) return null;

    const filteredButtons = toolbarButtons.filter(btn =>
        btn.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (!editor) return;

        const updateToolbarPosition = () => {
            const { state, view } = editor;
            const { from } = state.selection;
            const start = view.coordsAtPos(from);

            setFloatingPosition({
                top: start.top + window.scrollY + 40, // adjust as needed
                left: (start.left + window.scrollX) > (screenWidth - 300) ? screenWidth - 300 : start.left + window.scrollX,
            });
        };

        // Listen on selection + input updates
        editor.on("selectionUpdate", updateToolbarPosition);
        editor.on("transaction", updateToolbarPosition);

        // Initial call
        updateToolbarPosition();

        return () => {
            editor.off("selectionUpdate", updateToolbarPosition);
            editor.off("transaction", updateToolbarPosition);
        };
    }, [editor]);

    return (
        <>
            <div
                ref={toolbarRef}
                style={{
                    display: "flex",
                    flexDirection: "column",
                    width: "250px",
                    maxHeight: "400px",
                    overflow: "auto",
                    gap: "12px",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    backgroundColor: "#f9f9f9",
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
                    marginBottom: "12px",
                    position: "absolute",
                    top: floatingPosition.top,
                    left: floatingPosition.left,
                }}
            >   <input
                    placeholder="Search"
                    style={{
                        border: "1px solid #e5e7eb", // border-gray-200
                        borderRadius: "1rem",     // rounded (default = 4px)
                        padding: "10px",             // p-[10px]
                    }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={() => setOpen(!open)} style={{
                    cursor: "pointer",
                    paddingLeft: "1.25rem",    // px-5 = 20px
                    paddingRight: "1.25rem",
                    paddingTop: "0.5rem",      // py-2 = 8px
                    paddingBottom: "0.5rem",
                    borderRadius: "9999px",    // rounded-full
                    backgroundImage: "linear-gradient(to right, #3b82f6, #6366f1)", // from-blue-500 to-indigo-500
                    color: "white",
                    fontWeight: 600,           // font-semibold
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)", // shadow-md
                    transition: "all 200ms ease-in-out",
                    outline: "none",
                }}>
                    ✨ AI
                </button>


                {filteredButtons.map((btn, idx) => (
                    <ToolbarButton
                        key={idx}
                        onClick={btn.onClick}
                        isActive={btn.isActive()}
                        icon={btn.icon}
                        label={btn.label}
                        color={btn.color}
                    />
                ))}
                <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    onChange={handleImageUpload}
                    style={{
                        display: "none",
                    }}
                />

            </div>
            {open && <Model setOpen={setOpen} generateResponse={generateResponseByAI} />}
            {loader && <Loader />}
        </>
    );
};

export default NickifyToolbar;
