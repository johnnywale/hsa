"use client"

import React, { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneDark } from "react-syntax-highlighter/dist/cjs/styles/prism"
import data from "@emoji-mart/data"
import Picker from "@emoji-mart/react"
import { CodeComponent } from "react-markdown/lib/ast-to-react"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/registry/new-york-v4/ui/card"
import { Button } from "@/registry/new-york-v4/ui/button"
import { Textarea } from "@/registry/new-york-v4/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/new-york-v4/ui/dropdown-menu"
import { ScrollArea } from "@/registry/new-york-v4/ui/scroll-area"

type Message = {
  id: number;
  role: "user" | "bot";
  content: string;
  file?: { name: string; url: string; type: string }[];
};

export function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [selectedFiles, setSelectedFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [pickerPosition, setPickerPosition] = useState<"top" | "bottom">("top")

  const [openMenuId, setOpenMenuId] = useState<number | null>(null)


  const CodeBlock: CodeComponent = ({
                                      inline,
                                      className,
                                      children,
                                      ...props
                                    }) => {
    const match = /language-(\w+)/.exec(className || "")

    return !inline && match ? (
      <SyntaxHighlighter
        style={oneDark}
        language={match[1]}
        PreTag="div"
        {...props}
      >
        {String(children).replace(/\n$/, "")}
      </SyntaxHighlighter>
    ) : (
      <code className="bg-muted px-1 rounded" {...props}>
        {String(children).trim()}
      </code>
    )
  }


  const toggleMenu = (id: number) => {
    setOpenMenuId((prev) => (prev === id ? null : id))
  }

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)
    setOpenMenuId(null)
  }

  const handleDelete = (id: number) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id))
    setOpenMenuId(null)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const togglePicker = () => {
    const rect = inputRef.current?.getBoundingClientRect()
    if (!rect) return
    setPickerPosition(rect.top < 350 ? "bottom" : "top")
    setShowEmojiPicker((v) => !v)
  }

  const addEmoji = (emoji: any) => {
    const cursorPos = inputRef.current?.selectionStart || input.length
    const newText =
      input.slice(0, cursorPos) + emoji.native + input.slice(cursorPos)
    setInput(newText)
    setShowEmojiPicker(false)
    setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.setSelectionRange(
        cursorPos + emoji.native.length,
        cursorPos + emoji.native.length,
      )
    }, 0)
  }

  useEffect(() => {
    return () => {
      messages.forEach((msg) => {
        msg.file?.forEach((f) => URL.revokeObjectURL(f.url))
      })
      selectedFiles.forEach((file) => {
        URL.revokeObjectURL(URL.createObjectURL(file))
      })
    }
  }, [messages, selectedFiles])

  const fetchBotReply = async (): Promise<string> => {
    return new Promise((res) => {
      setTimeout(() => {
        res(
          "你好！这是带有代码高亮的回复 😄\n\n```js\nfunction hello() {\n  console.log('Hello, PrismJS!');\n}\nhello();\n```\n\n你可以试试更多语言的代码块！",
        )
      }, 1000)
    })
  }

  const handleSend = async () => {
    if (!input.trim() && selectedFiles.length === 0) return

    let fileAttachments
    if (selectedFiles.length > 0) {
      fileAttachments = selectedFiles.map((file) => ({
        name: file.name,
        url: URL.createObjectURL(file),
        type: file.type,
      }))
    }

    const userMsg: Message = {
      id: Date.now(),
      role: "user",
      content: input.trim(),
      file: fileAttachments,
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setSelectedFiles([])
    setLoading(true)
    const botReply = await fetchBotReply()
    const botMsg: Message = {
      id: Date.now() + 1,
      role: "bot",
      content: botReply,
    }
    setMessages((prev) => [...prev, botMsg])
    setLoading(false)
  }




  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files)
      setSelectedFiles((prev) => {
        const allFiles = [...prev, ...newFiles]
        return allFiles.filter(
          (file, index, self) =>
            index ===
            self.findIndex(
              (f) =>
                f.name === file.name &&
                f.size === file.size &&
                f.lastModified === file.lastModified,
            ),
        )
      })
    }
  }

  return (
    <Card className="h-full flex flex-col relative">
      <CardHeader>
        <CardTitle> Title </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col flex-1">
        <ScrollArea className="flex-1 p-4 bg-muted rounded mb-4 space-y-4">
          {messages.map(({ id, role, content, file }) => (
            <div
              key={id}
              className={`flex ${role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative max-w-[70%] px-4 py-2 rounded-lg whitespace-pre-wrap break-words ${
                  role === "user"
                    ? "bg-primary text-primary-foreground rounded-br-none"
                    : "bg-secondary text-secondary-foreground rounded-bl-none"
                }`}
              >
                <DropdownMenu open={openMenuId === id} onOpenChange={() => toggleMenu(id)}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`absolute top-1 ${
                        role === "user" ? "left-1" : "right-1"
                      }`}
                    >
                      ⋮
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent side={role === "user" ? "left" : "right"}>
                    <DropdownMenuItem onClick={() => handleCopy(content)}>
                      📋 复制
                    </DropdownMenuItem>
                    {file && file.length > 0 && (
                      <>
                        {file.map((f, idx) => (
                          <DropdownMenuItem asChild key={idx}>
                            <a href={f.url} download={f.name}>
                              ⬇️ 下载附件: {f.name}
                            </a>
                          </DropdownMenuItem>
                        ))}
                      </>
                    )}
                    <DropdownMenuItem onClick={() => handleDelete(id)}>
                      🗑 删除
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {content && (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code: CodeBlock,
                    }}
                  >
                    {content}
                  </ReactMarkdown>
                )}

                {file && (
                  <div className="mt-2 space-y-2">
                    {file.map((f, idx) =>
                      f.type.startsWith("image/") ? (
                        <img
                          key={idx}
                          src={f.url}
                          alt={f.name}
                          className="max-w-full rounded"
                        />
                      ) : (
                        <a
                          key={idx}
                          href={f.url}
                          download={f.name}
                          className="text-blue-500 underline block"
                        >
                          📎 {f.name}
                        </a>
                      ),
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div
                className="max-w-[70%] px-4 py-2 rounded-lg bg-secondary text-secondary-foreground animate-pulse rounded-bl-none">
                机器人正在输入...
              </div>
            </div>
          )}
        </ScrollArea>

        {/* Input Row */}
        <div className="relative flex items-start gap-2">
          <Textarea
            ref={inputRef}
            value={input}
            onKeyDown={handleKeyDown}
            onChange={(e) => setInput(e.target.value)}
            placeholder="请输入消息..."
            rows={3}
            disabled={loading}
            className="flex-1 pr-10"
          />
          <div className="flex flex-col gap-1">
            <div className="relative inline-block">
              <Button
                variant="outline"
                type="button"
                onMouseDown={togglePicker}
              >
                😀
              </Button>

              {showEmojiPicker && (
                <div
                  className={`absolute z-50 ${
                    pickerPosition === "top" ? "bottom-full mb-2" : "top-full mt-2"
                  }`}
                >
                  <Picker data={data} onEmojiSelect={addEmoji} emojiSize={20} perLine={8} />
                </div>
              )}
            </div>

            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              type="button"
              disabled={loading}
            >
              📎
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              className="hidden"
              multiple
            />
          </div>
        </div>

        {selectedFiles.length > 0 && (
          <div className="mt-2 text-sm text-muted-foreground space-y-1">
            {selectedFiles.map((file, idx) => (
              <div key={idx}>{file.name}</div>
            ))}
          </div>
        )}


        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            onClick={() => setInput("")}
            disabled={loading}
            type="button"
          >
            清空输入
          </Button>
          <Button onClick={handleSend} className="flex-1" type="button">
            发送
          </Button>
          <Button
            variant="outline"
            onClick={() => setSelectedFiles([])}
            disabled={loading}
            type="button"
          >
            清空文件
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
