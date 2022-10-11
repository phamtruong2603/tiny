import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

export default function App() {
  const editorRef = useRef(null);
  const log = () => {
    if (editorRef.current) {
      console.log(editorRef.current.getContent());
    }
  };
  const youtube_parser = (url) => {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
    var match = url.match(regExp);
    return (match && match[7].length === 11) ? match[7] : false;
  }

  return (
    <>
      <Editor
        onInit={(evt, editor) => {
          return editorRef.current = editor
        }}
        initialValue=''
        apiKey='qncahgo1xvpwopoou5vjkysx5glaxgrkxa7o71jn9tqu1d31'
        init={{
          height: 500,
          menubar: true,
          file_picker_callback: (callback, value, meta) => {
            //Upload files from computer
            if (meta.filetype === 'image') {
              const input = document.createElement('input');
              input.setAttribute('type', 'file');
              input.setAttribute('accept', 'image/*');
              input.addEventListener('change', (e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.addEventListener('load', () => {
                  const id = 'blobid' + (new Date()).getTime();
                  const blobCache = window.tinymce.activeEditor.editorUpload.blobCache;
                  const base64 = reader.result.split(',')[1];
                  const blobInfo = blobCache.create(id, file, base64);
                  blobCache.add(blobInfo);
                  callback(blobInfo.blobUri(), { title: file.name });
                });
                reader.readAsDataURL(file);
              });
              input.click();
            }
          },
          setup: editor => {
            editor.editorManager.PluginManager.add("YouTB", function (
              editor
            ) {
              const openDialog = () => editor.windowManager.open({
                title: 'Link',
                body: {
                  type: 'panel',
                  items: [
                    {
                      type: 'input',
                      name: 'title',
                      label: 'your path'
                    }
                  ]
                },
                buttons: [
                  {
                    type: 'cancel',
                    text: 'Close'
                  },
                  {
                    type: 'submit',
                    text: 'Save',
                    buttonType: 'primary'
                  }
                ],
                onSubmit: (api) => {
                  const data = api.getData();
                  const url = youtube_parser(data.title)
                  editor.setContent(
                    `${editorRef.current.getContent()}
                    <iframe src="https://youtube.com/embed/${url}"></iframe>`,
                    { format: 'html' });
                  api.close();
                }
              });
              editor.ui.registry.addButton('YouTB', {
                text: 'YouTB',
                onAction: () => {
                  openDialog();
                }
              });
              return {
                getMetadata: () => ({
                  name: 'YouTB plugin',
                  url: ''
                })
              };
            })
          },

          plugins: [
            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap',
            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
            'insertdatetime', 'media', 'table', 'preview', 'help', 'wordcount'
          ],
          toolbar: 'undo redo | formatselect | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | media' +
            '',
          content_style: 'body {font - family:Helvetica,Arial,sans-serif; font-size:14px }'
        }}
      />
      <button onClick={log}>Log editor content</button>
    </>
  );
}