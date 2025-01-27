import { animate, motion, useMotionValue } from 'motion/react'
import { useEffect } from 'react'

interface TypewriterProps {
	text: string
	duration: number
}

const Typewriter = ({ text, duration }: TypewriterProps) => {
	const displayText = useMotionValue('')

	useEffect(() => {
		const animation = animate(0, text.length, {
			duration,
			ease: 'linear',
			onUpdate: (value) => {
				displayText.set(text.slice(0, Math.ceil(value)))
			},
		})

		return () => animation.stop()
	}, [text, duration, displayText])

	return <motion.span>{displayText}</motion.span>
}

export default Typewriter
