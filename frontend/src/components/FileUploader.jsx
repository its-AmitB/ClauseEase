import { useDropzone } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';

export default function FileUploader({ onFileSelect, disabled }) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0]);
      }
    },
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    disabled,
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-xl p-12 flex flex-col items-center justify-center transition-all cursor-pointer ${
        disabled
          ? 'opacity-50 cursor-not-allowed border-gray-600 bg-[#111A2E]'
          : isDragActive
          ? 'border-[var(--color-accent-teal)] bg-[var(--color-accent-teal)]/5'
          : 'border-[#1F2A40] bg-[#111A2E] hover:border-gray-400'
      }`}
    >
      <input {...getInputProps()} />
      <UploadCloud className={`w-12 h-12 mb-4 ${isDragActive ? 'text-[var(--color-accent-teal)]' : 'text-gray-500'}`} />
      <p className="font-medium text-lg mb-1 text-center text-gray-200">
        {isDragActive ? 'Drop your document here...' : 'Upload Legal Document'}
      </p>
      <p className="text-sm text-gray-500 text-center">Supports .pdf and .docx</p>
    </div>
  );
}
