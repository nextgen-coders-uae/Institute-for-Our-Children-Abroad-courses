/** Sample certificate (illustrative). Replace with a real certificate image in /public/images/certificate-sample.webp if desired. */
export function CertificatePreview({ course, locale }: { course: string; locale: "ar" | "en" }) {
  const ar = locale === "ar";
  return (
    <div className="relative overflow-hidden rounded-2xl border-4 border-double border-gold-500 bg-papyrus-50 p-6 text-center shadow-inner sm:p-8" aria-label={ar ? "نموذج الشهادة" : "Sample certificate"} role="img">
      <div className="bg-hieroglyphs absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="relative">
        <p className="font-display text-xs tracking-[0.3em] text-gold-700 uppercase">{ar ? "معهد أبناؤنا في الخارج" : "Abnaona Institute Abroad"}</p>
        <p className="mt-2 font-display text-2xl text-lapis-800 sm:text-3xl">{ar ? "شهادة إتمام" : "Certificate of Completion"}</p>
        <div className="mx-auto my-3 h-px w-24 bg-gold-500" />
        <p className="text-sm text-copper-700">{ar ? "تشهد كورسات أبناؤنا بأن المتدرب/ة" : "This certifies that"}</p>
        <p className="mt-1 font-display text-xl text-ink">{ar ? "اسم المتدرب" : "Trainee Name"}</p>
        <p className="mt-1 text-sm text-copper-700">{ar ? "قد أتم بنجاح كورس" : "has successfully completed"}</p>
        <p className="mt-1 font-bold text-lapis-800">{course}</p>
        <div className="mt-5 flex items-end justify-between text-[10px] text-copper-700">
          <span dir="ltr" className="font-mono">No. ABC-2026-0001</span>
          <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-gold-500 bg-gold-100 font-display text-[9px] font-bold text-gold-800">
            {ar ? "ختم" : "SEAL"}
          </span>
          <span>{ar ? "توقيع المدير" : "Director"}</span>
        </div>
      </div>
    </div>
  );
}
