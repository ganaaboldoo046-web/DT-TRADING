import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { COMPANY } from '../constants/company';

export default function Terms() {
    return (
        <div className="min-h-screen bg-app text-ink flex flex-col">
            <Header title="Үйлчилгээний нөхцөл" hideLogo showBack />
            <main className="flex-1 w-full max-w-[880px] mx-auto px-4 lg:px-6 py-6 lg:py-12">
                <h1 className="text-2xl lg:text-[30px] font-extrabold tracking-tight mb-1">Үйлчилгээний нөхцөл</h1>
                <p className="text-[12.5px] lg:text-[13px] text-muted mb-5 lg:mb-7">{COMPANY.name} ({COMPANY.tagline})</p>

                <div className="bg-surface border border-line rounded-2xl p-5 lg:px-11 lg:py-10 space-y-6 lg:space-y-8 text-[13.5px] lg:text-[14.5px] leading-[1.75] lg:leading-[1.8] text-ink-2">
                    <section>
                        <h2 className="text-base font-extrabold text-ink mb-2">1. Нийтлэг үндэслэл</h2>
                        <p>
                            Энэхүү үйлчилгээний нөхцөл нь "{COMPANY.name}" (цаашид "Компани" гэх)-ийн үзүүлж буй
                            автомашин худалдаа, зуучлалын үйлчилгээг хэрэглэгч ашиглахтай холбоотой харилцааг зохицуулна.
                            Хэрэглэгч манай үйлчилгээг ашигласнаар энэхүү нөхцөлийг хүлээн зөвшөөрсөнд тооцогдоно.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-extrabold text-ink mb-2">2. Үйлчилгээний төрөл</h2>
                        <ul className="list-disc pl-5 space-y-1">
                            <li>БНСУ-аас автомашин худалдан авах зуучлал</li>
                            <li>Автомашины тээвэрлэлт, гаалийн бүрдүүлэлтийн зөвлөгөө</li>
                            <li>Захиалгын дагуу автомашин хайх, шалгах</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-base font-extrabold text-ink mb-2">3. Захиалга ба Төлбөр</h2>
                        <p>
                            Хэрэглэгч вэбсайтаар дамжуулан автомашин захиалах хүсэлт илгээх боломжтой.
                            Захиалга баталгаажсаны дараа төлбөрийн нөхцөлийг талууд харилцан тохиролцоно.
                            Захиалга цуцлах тохиолдолд гарсан зардлыг хэрэглэгч хариуцна.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-extrabold text-ink mb-2">4. Хэрэглэгчийн бүртгэл</h2>
                        <p>
                            Хэрэглэгч Google хаягаараа нэвтэрч бүртгэл үүсгэх боломжтой. Бүртгэлийн мэдээллийг хэрхэн
                            цуглуулж, ашиглах талаар <Link to="/privacy" className="text-primary font-bold">Нууцлалын бодлого</Link>-оос
                            дэлгэрэнгүй уншина уу. Хэрэглэгч хүссэн үедээ бүртгэлээ устгуулах хүсэлт гаргаж болно.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-extrabold text-ink mb-2">5. Хариуцлага</h2>
                        <p>
                            Компани нь автомашины бодит байдал, техникийн үзүүлэлтийг үнэн зөв мэдээлэх үүрэгтэй.
                            Гэвч байгалийн давагдашгүй хүчин зүйл, тээвэрлэлтийн явцад үүссэн хохиролд компани
                            шууд хариуцлага хүлээхгүй.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-base font-extrabold text-ink mb-2">6. Холбоо барих</h2>
                        <p>Үйлчилгээтэй холбоотой санал хүсэлт, гомдлыг доорх хаягаар хүлээн авна.</p>
                        <div className="mt-2 text-muted font-medium">
                            <p className="text-ink font-bold">{COMPANY.name}</p>
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
