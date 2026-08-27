import Link from "next/link";

type ButtonProps = {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "light";
  href?: string;
  newTab?: boolean;
  type?: "button" | "submit";
  className?: string;
  disabled?: boolean;
};

const Button = ({
  children,
  variant = "primary",
  href,
  newTab,
  type = "button",
  className = "",
  disabled,
}: ButtonProps) => {
  const baseClasses =
    "inline-flex min-h-12 items-center justify-center border px-6 py-3 text-[0.75rem] font-bold uppercase tracking-[0.1em] transition-colors duration-200";

  const variantClasses = {
    primary:
      "border-(--olive) bg-(--olive) text-(--cream) hover:border-(--olive-light) hover:bg-(--olive-light)",
    outline:
      "border-(--brown) bg-transparent text-(--brown) hover:bg-(--brown) hover:text-(--cream)",
    light:
      "border-(--cream) bg-(--cream) text-(--olive) hover:border-(--gold) hover:bg-(--gold) hover:text-(--ink)",
  };

  const contents = <span>{children}</span>;

  if (href) {
    return (
      <Link
        href={href}
        target={newTab ? "_blank" : undefined}
        rel={newTab ? "noopener noreferrer" : undefined}
        className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      >
        {contents}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {contents}
    </button>
  );
};

export default Button;
