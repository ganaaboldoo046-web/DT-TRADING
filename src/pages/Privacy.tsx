import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { COMPANY } from '../constants/company';

export default function Privacy() {
    return (
        <div className="min-h-screen bg-app text-ink flex flex-col">
            <Header title="Нууцлалын бодлого" hideLogo showBack />
            <main className="flex-1 w-full max-w-[880px] mx-auto px-4 lg:px-6 py-6 lg:py-12">
                <h1 className="text-2xl lg:text-[30px] font-extrabold tracking-tight mb-1">Нууцлалын бодлого</h1>
                <p className="text-[12.5px] lg:text-[13px] text-muted mb-5 lg:mb-7">{COMPANY.name} ({COMPANY.tagline})</p>

                <div className="bg-surface border border-line rounded-2xl p-5 lg:px-11 lg:py-10 space-y-6 lg:space-y-8 text-[13.5px] lg:text-[14.5px] leading-[1.75] lg:leading-[1.8] text-ink-2">
                    <section>
                        <h2 className="text-base font-extrabold text-ink mb-2">1. Мэдээлэл цуглуулах</h2>
                        <p>
                            "{COMPANY.name}" нь хэрэглэгчид үйлчилгээ үзүүлэх зорилгоор дараах хувийн мэдээллийг цуглуулна:
                        </p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Овог, Нэр</li>
                            <li>Утасны дугаар, Имэйл хаяг</li>
                            <li>Google хаягаар нэвтрэх үед: нэр, имэйл хаяг, профайл зураг</li>
                            <li>Захиалгын мэдээлэл</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base font-extrabold text-ink mb-2">2. Мэдээлэл ашиглах зорилго</h2>
                        <p>Цуглуулсан мэдээллийг дараах зорилгоор ашиглана:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Хэрэглэгчтэй холбоо барих, зөвлөгөө өгөх</li>
                            <li>Захиалгыг баталгаажуулах, гүйцэтгэх</li>
                            <li>Хэрэглэгчийн бүртгэл үүсгэх, хадгалсан зар болон захиалгын түүхийг харуулах</li>
                            <li>Шинэ бүтээгдэхүүн, үйлчилгээний талаар мэдээлэл хүргэх</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base font-extrabold text-ink mb-2">3. Google хаягаар нэвтрэх</h2>
                        <p>
                            Хэрэглэгч Google хаягаараа нэвтэрсэн тохиолдолд бид зөвхөн үндсэн профайлын мэдээлэл
                            (нэр, имэйл хаяг, профайл зураг)-ыг хүлээн авна. Бид таны Google бүртгэлийн нэвтрэх код,
                            захидал, файл болон бусад өгөгдөлд хандахгүй. Энэхүү мэдээллийг зөвхөн таны бүртгэлийг
                            танихад ашиглах бөгөөд сурталчилгааны зорилгоор гуравдагч этгээдэд дамжуулахгүй.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-extrabold text-ink mb-2">4. Мэдээллийн аюулгүй байдал</h2>
                        <p>
                            Бид хэрэглэгчийн хувийн мэдээллийг гуравдагч этгээдэд задруулахгүй, худалдахгүй бөгөөд
                            аюулгүй байдлыг хангах техникийн арга хэмжээг авч ажиллана.
                            Зөвхөн хуулийн байгууллагын албан ёсны шаардлагаар мэдээллийг гаргаж өгч болно.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-extrabold text-ink mb-2">5. Мэдээлэл устгах</h2>
                        <p>
                            Хэрэглэгч хүсэлт гаргасан тохиолдолд өөрийн бүртгэлтэй мэдээллийг системээс устгуулах эрхтэй.
                            Үүний тулд доорх холбоо барих сувгаар бидэнд хандана уу.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-extrabold text-ink mb-2">6. Холбоо барих</h2>
                        <p>Нууцлалын бодлоготой холбоотой асуулт, хүсэлтийг доорх хаягаар хүлээн авна.</p>
                        <div className="mt-2 text-muted font-medium">
                            <p className="text-ink font-bold">{COMPANY.name}</p>
                            <p>Хувийн мэдээлэл хариуцсан ажилтан</p>
                            <p>Утас: {COMPANY.phoneMain} / {COMPANY.phoneSub}</p>
                            {COMPANY.email && <p>Имэйл: {COMPANY.email}</p>}
                            <p>Хаяг: {COMPANY.address}</p>
                        </div>
                    </section>
                </div>

                <div className="mt-6 text-center pb-24">
                    <Link to="/" className="text-primary font-bold hover:underline">Нүүр хуудас руу буцах</Link>
                </div>
            </main>
            <Footer />
        </div>
    );
}
