import Marquee from "react-fast-marquee";
import company1 from "../../../../assets/brands/amazon.png";
import company2 from "../../../../assets/brands/amazon_vector.png";
import company3 from "../../../../assets/brands/casio.png";
import company4 from "../../../../assets/brands/moonstar.png";
import company5 from "../../../../assets/brands/randstad.png";
import company6 from "../../../../assets/brands/start-people 1.png";
import company7 from "../../../../assets/brands/start.png";


const logos = [company1, company2, company3, company4, company5, company6, company7];

export default function ClientLogosMarquee() {
  return (
  
      <section className="py-12 bg-base-200">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">Trusted By</h2>
        <div className="relative overflow-hidden mt-8">
          {/* Slider wrapper */}
         <Marquee>
             <div className="flex animate-scroll">
            {[...logos, ...logos].map((logo, index) => (
              <div key={index} className="mx-20 flex-shrink-0 px-8">
                <img
                  src={logo}
                  alt={`Client logo ${index + 1}`}
                  className="h-6 w-auto object-contain"
                />
              </div>
            ))}
          </div>
         </Marquee>
        </div>
      </div>
    </section>
  
  );
}
