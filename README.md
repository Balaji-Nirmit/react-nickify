
# 📦 React-nickify

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

<img width="1470" alt="image" src="https://github.com/user-attachments/assets/64cdbf4f-71fa-4b68-b0ba-9c6aded74f3c" />

- On text selection also

<img width="1470" alt="image" src="https://github.com/user-attachments/assets/c96e7cd5-b6ec-42b6-a173-843d589b6323" />



## 📦 AI Response
to generate AI response
configure GEMINI API KEY
make a .env.local file and add 
```bash
VITE_GEMINI_API_KEY="your api key"
```
and then 
```js
<Nickify  setContent={setContent} isAiEnabled={true}></Nickify>
```

## 📦 Developer guide
> generate a pull request to LPW branch only



<!-- Copy-paste in your Readme.md file -->
# Contributors
<a href="https://github.com/Balaji-Nirmit/react-nickify/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Balaji-Nirmit/react-nickify" />
</a>

