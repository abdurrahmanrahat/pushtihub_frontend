import Image from "next/image";
import Link from "next/link";

const WhatsAppAction = () => {
  const whatsAppNumber = "+8801332641071";
  const baseUrl = "https://api.whatsapp.com/send/";
  const encodedMessage = "Hi there, is there anyone to assist me?";
  const whatsAppLink = `${baseUrl}?phone=${whatsAppNumber}&text=${encodedMessage}&type=phone_number&app_absent=0`;

  return (
    <div className="fixed bottom-[20px] right-[20px] sm:bottom-[30px] sm:right-[40px] 2xl:right-[60px] z-[50]">
      <Link
        href={whatsAppLink}
        className="whatsapp-line relative"
        target="_blank"
        rel="noreferrer noopener"
      >
        <Image
          src="/images/others/whatsapp.png"
          alt="whatsapp"
          width={48}
          height={48}
          className="w-12 h-12 z-50"
        />
      </Link>
    </div>
  );
};

export default WhatsAppAction;
