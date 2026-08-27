import Container from "./Container";

type SectionProps = {
  children: React.ReactNode;
  id?: string;
  tone?: "ivory" | "cream" | "olive";
  className?: string;
};

const Section = ({ children, id, tone = "ivory", className = "" }: SectionProps) => {
  const toneClasses = {
    ivory: "bg-(--ivory) text-(--ink)",
    cream: "bg-(--cream) text-(--ink)",
    olive: "bg-(--olive) text-(--cream)",
  };

  return (
    <section id={id} className={`scroll-mt-28 py-20 sm:py-24 lg:py-32 ${toneClasses[tone]} ${className}`}>
      <Container>{children}</Container>
    </section>
  );
};

export default Section;
