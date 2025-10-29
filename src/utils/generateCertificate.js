import jsPDF from "jspdf";
import sertifikatImg from "../assets/sertifikat.jpg";

export const generateCertificate = async (canvasRef, name, course, certId, date) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const image = new Image();
    image.src = sertifikatImg;

    return new Promise((resolve) => {
        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0, image.width, image.height);

            // 🔠 Ism
            ctx.fillStyle = "black";
            ctx.font = "65px Arial";
            ctx.textAlign = "center";
            ctx.fillText(name, canvas.width / 2, 360);

            // 🔵 Kurs nomi
            ctx.fillStyle = "#0057A3";
            ctx.font = "40px Arial";

            if (course === "Kompyuter Savodxonligi") {
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                const cr_x = (course?.length || 0) / 2;
                const x = canvas.height / 2 - cr_x;
                const y = 493;
                ctx.fillText(course || "", x, y);
            } else {
                ctx.textAlign = "right";
                ctx.textBaseline = "middle";
                const len = course?.length || 0;
                const x = canvas.width / 2 + len - 10;
                const y = 493;
                ctx.fillText(course || "", x, y);
            }

            // Sana
            const dateText =
                date ||
                new Date().toLocaleDateString("uz-UZ", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                });
            ctx.fillStyle = "black";
            ctx.font = "28px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(dateText, 863, 739);

            // ID
            ctx.fillText(certId || "", 603, 739);

            const pdf = new jsPDF({
                orientation: "landscape",
                unit: "px",
                format: [canvas.width, canvas.height],
            });

            const imgData = canvas.toDataURL("image/jpeg", 1.0);
            pdf.addImage(imgData, "JPEG", 0, 0, canvas.width, canvas.height);

            const pdfBlob = pdf.output("blob");
            const fileURL = URL.createObjectURL(pdfBlob);

            resolve({ name, certId, url: fileURL });
        };
    });
};
