
# 📦 React-nickify

> A brief one-liner description of what your package does.

![npm](https://img.shields.io/npm/v/react-nickify.svg) ![License](https://img.shields.io/npm/l/react-nickify.svg)   ![Downloads](https://img.shields.io/npm/dt/react-nickify.svg)

---

## ✨ Features

- ✅ Rich text editor with a customized toolbar
- ✅ AI integrated with in editor responses
- ✅ Build over react tiptap 

## 📦 Installation and Use

Using npm:

```bash
npm install react-nickify
```
Calling the Nickify Component

```ts
import  Nickify  from  'react-nickify'
```
```ts
const [content,setContent]=useState<string>('')

return (
<>
   <Nickify  setContent={setContent} isAiEnabled={false}></Nickify>
   <article className="tiptap" dangerouslySetInnerHTML={{__html: content }}/>
</>
)
```
🛠Accessing the Toolbar

- Windows: Ctrl + Arrow Down

- Mac: Cmd + Arrow Down



## 📦 AI Response
to generate AI response
configure GEMINI API KEY
make a 
```bash
VITE_GEMINI_API_KEY="your api key"
```
and then 
```js
<Nickify  setContent={setContent} isAiEnabled={true}></Nickify>
```

## 📦 Developer guide
> generate a pull request to LPW branch only
