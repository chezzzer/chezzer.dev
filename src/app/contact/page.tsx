import ContactForm from "@/components/ContactForm/ContactForm";

export default function Home() {
    return (
        <>
            <div>
                <h2 className="fields text-3xl">Let&apos;s Talk</h2>
                <p>
                    Use this form to get in touch with me. If I&apos;m online
                    right now, I should reply pretty soon.
                </p>
                <ContactForm />
            </div>
        </>
    );
}
