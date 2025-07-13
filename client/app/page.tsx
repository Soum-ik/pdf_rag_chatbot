'use client';

import FileUploadComponent from './components/file-upload';
import ChatComponent from './components/chat';

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex flex-col lg:flex-row">
      <div className="w-full lg:w-[30vw] p-6 flex justify-center items-center min-h-[300px] lg:min-h-full">
        <FileUploadComponent />
      </div>
      <div className="w-full lg:w-[70vw] border-t lg:border-t-0 lg:border-l border-white/10">
        <ChatComponent />
      </div>
    </div>
  );
}

