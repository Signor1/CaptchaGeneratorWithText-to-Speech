import { useEffect, useState } from "react";
import { RefreshBtn } from "./svg/RefreshBtn";
import { Send } from "./svg/Send";
import { Speaker } from "./svg/Speaker";

const Captcha = () => {
    //states
    const [captchaText, setCaptchaText] = useState<string>('')
    const [captchaInput, setCaptchaInput] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [messageColor, setMessageColor] = useState<string>('#000')
    const [isSpeaking, setIsSpeaking] = useState<boolean>(false)

    //function for captcha generation
    const generateCaptcha = () => {
        const randomString = Math.random().toString(36).substring(2, 7);
        const randomStringArray = randomString.split('');
        const changedString = randomStringArray.map((character) => Math.random() > 0.5 ? character.toUpperCase() : character)

        const captchaText = changedString.join(' ')
        setCaptchaText(captchaText)
    }

    const validateCaptcha = () => {
        const formattedCaptcha = captchaText.replace(/\s/g, '');
        if (formattedCaptcha === captchaInput) {
            setMessageColor('green');
            setMessage('Entered captcha is correct')
        } else {
            setMessageColor('#ff2525')
            setMessage('Entered captcha is not correct')
        }
    }

    useEffect(() => {
        generateCaptcha()
    }, [])

    const msg = new SpeechSynthesisUtterance()

    msg.onstart = () => {
        setIsSpeaking(true)
    }
    msg.onend = () => {
        setIsSpeaking(false)
    }

    const handleSpeech = (msg: SpeechSynthesisUtterance) => {
        msg.text = captchaText
        msg.rate = 0.5
        window.speechSynthesis.speak(msg)
    }


    return (
        <section className="flex flex-col items-center md:w-[500px] w-full px-6 py-10 rounded-lg shadow border bg-gray-100 border-gray-200">
            <h1 className="font-bold uppercase md:text-xl text-lg mb-4 text-gray-700">Captcha</h1>
            {/* View generated captcha */}
            <div className="w-full relative">
                <input type="text" value={captchaText} disabled className="font-elites text-center md:text-3xl text-2xl block w-full tracking-wide px-3 py-6 bg-gray-200 font-semibold rounded text-gray-900 focus:outline-none" />
                {/* Text to speech button */}
                <button onClick={() => handleSpeech(msg)} className="absolute right-0 bottom-0 bg-gray-800 text-gray-100 px-2 py-2 rounded-br">
                    <Speaker />
                </button>
            </div>
            {isSpeaking && <p className="text-green-600 text-sm self-start">Speaking...</p>}

            {/* Type in captcha */}
            <div className="w-full flex items-stretch h-10 gap-1 mt-6">
                <input type="text"
                    value={captchaInput}
                    placeholder="Enter captcha"
                    className="w-full rounded-s-lg px-3 bg-white focus:outline-none border transition-all duration-200 focus:border-gray-800"
                    onChange={e => setCaptchaInput(e.target.value)}
                />
                {/* Refresh captcha button */}
                <button onClick={generateCaptcha} className="bg-gray-800 px-3 text-blue-50 rounded-e-lg">
                    <RefreshBtn />
                </button>
            </div>
            {/* Error or success message */}
            <div className="text-base mt-2" style={{ color: messageColor }}>
                {message}
            </div>

            {/* submission button */}
            <div className="w-full flex justify-center mt-6">
                <button
                    onClick={validateCaptcha}
                    className="bg-gray-800 text-white text-sm flex uppercase gap-0.5 px-6 py-2.5 rounded-lg items-center">
                    Send
                    <Send />
                </button>
            </div>
        </section>
    )
}

export default Captcha
