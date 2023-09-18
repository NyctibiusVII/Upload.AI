import {
    useState,
    useEffect
} from 'react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from './ui/select'

import { api } from '@/lib/axios'

interface PromptSelectProps {
    onPromptSelected: (template: string) => void
}

type Prompt = {
    id:       string
    title:    string
    template: string
}

export function PromptSelect(props: PromptSelectProps) {
    const [prompts, setPrompts] = useState<Prompt[] | null>(null)

    function handlePromptSelected(promptId: string) {
        const selectedPrompt = prompts?.find(prompt => prompt.id === promptId)

        if (!selectedPrompt) return

        props.onPromptSelected(selectedPrompt.template)
    }

    useEffect(() => {
        api.get('/prompts')
            .then(response => setPrompts(response.data))
    }, [])

    return (
        <Select onValueChange={handlePromptSelected}>
            <SelectTrigger>
                <SelectValue placeholder='Selecione um prompt...' />
            </SelectTrigger>

            <SelectContent>
                {
                    prompts?.map(prompt => (
                        <SelectItem key={prompt.id} value={prompt.id}>
                            { prompt.title }
                        </SelectItem>
                    ))
                }
            </SelectContent>
        </Select>
    )
}