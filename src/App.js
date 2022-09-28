import React, { useRef, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';

function App() {

  const [contents, setContents] = useState([]);

  const editorRef = useRef();

  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
      setContents([
        {
          title: '',
          content: editorRef.current.getContent()
        },
        ...contents
      ])
    }
  };

  return (
    <div className="App">
      <Editor
        onInit={(evt, editor) => editorRef.current = editor}
        initialValue="<p>Tiny MCE editor.</p>"
        // apiKey='your-api-key'
        // inline={false}
        // outputFormat='text' // định dạng đầu ra
        init={{
          height: 350,
          menubar: true,
          plugins: [
            // 'advlist autolink lists link image charmap print preview anchor',
            // 'searchreplace visualblocks code fullscreen',
            // 'insertdatetime media table paste code help wordcount',

            'advlist', 'autolink', 'lists', 'link', 'image', 'table',
            'charmap', 'preview', 'anchor', 'pagebreak', 'tinymcespellchecker'
          ],
          toolbar: 'undo redo | formatselect | ' +
            'bold italic backcolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | help',
          content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />
      <button onClick={log}>Log editor content</button>
      <div className='body'>
        {contents.map((content) => {
          const text = content.content
          return (
            <div dangerouslySetInnerHTML={{ __html: text }} />
          )
        })}
      </div>
    </div>
  );
}

export default App;
