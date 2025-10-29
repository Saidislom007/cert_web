export default function CertificateList({ generatedFiles }) {
    return (
        <div className="mt-4">
            <h3 className="font-semibold text-lg mb-2">🧾 Yaratilgan sertifikatlar:</h3>
            <ul className="flex flex-col gap-2">
                {generatedFiles.map((file, index) => (
                    <li
                        key={index}
                        className="flex justify-between items-center border p-2 rounded"
                    >
                        <span>
                            {file.name} — {file.certId}
                        </span>
                        <a
                            href={file.url}
                            download={`${file.name}_${file.certId}.pdf`}
                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                        >
                            Yuklab olish
                        </a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
