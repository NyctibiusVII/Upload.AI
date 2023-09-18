import { useState } from 'react'
import { useCompletion } from 'ai/react'
import {
    Github,
    Wand2
} from 'lucide-react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from './components/ui/select'
import { Button }    from './components/ui/button'
import { Textarea }  from './components/ui/textarea'
import { Separator } from './components/ui/separator'
import { Label }     from './components/ui/label'
import { Slider }    from './components/ui/slider'
import { VideoInputForm } from './components/video-input-form'
import { PromptSelect }   from './components/prompt-select'

export function App() {
    const [temperature, setTemperature] = useState(0.3)
    const [videoId, setVideoId] = useState<string | null>(null)

    const {
        input,
        setInput,
        handleInputChange,
        handleSubmit,
        completion,
        isLoading
    } = useCompletion({
        api: 'http://localhost:3333/ai/complete',
        body: {
            videoId,
            temperature
        },
        headers: {
            'Content-Type': 'application/json'
        }
    })

	return (
		<div className='min-h-screen flex flex-col'>
			<header className='border-b px-6 py-3 flex items-center justify-between'>
                <h1 className='text-xl font-bold'>Upload.AI</h1>
                <Button variant={'outline'}>
                    <Github className='w-4 h-4 mr-2' />
                    Github
                </Button>
            </header>

            <main className='p-6 flex flex-1 gap-6'>
                <div className='flex flex-col flex-1 gap-4'>
                    <div className='grid grid-rows-2 gap-4 flex-1'>
                        <Textarea
                            className='resize-none p-4 leading-relaxed'
                            placeholder='Inclua o prompt para a IA...'
                            value={input}
                            onChange={handleInputChange}
                        />
                        <Textarea
                            className='resize-none p-4 leading-relaxed'
                            placeholder='Resultado gerado pela IA...'
                            value={completion}
                            readOnly
                        />
                    </div>

                    <p className='text-sm text-muted-foreground'>
                        Lembre-se: Você pode utilizar a variável <code className='text-violet-400'>&#x0007B;transcription&#x0007D;</code> no seu prompt para adicionar o  conteúdo da transcrição do video selecionado.
                    </p>
                </div>

                <aside className='w-80 space-y-6'>
                    <VideoInputForm onVideoUploaded={setVideoId} />

                    <Separator />

                    <form onSubmit={handleSubmit} className='space-y-6'>
                        <div className='space-y-2'>
                            <Label>Prompt</Label>
                            <PromptSelect onPromptSelected={setInput} />
                        </div>

                        <div className='space-y-2'>
                            <Label>Modelo</Label>
                            <Select defaultValue='gpt3.5' disabled>
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value='gpt3.5'>GPT 3.5-Turbo 16k</SelectItem>
                                </SelectContent>
                            </Select>
                            <span className='text-xs text-muted-foreground italic block'>Você poderá customizar está opção em breve</span>
                        </div>

                        <Separator />

                        <div className='space-y-4'>
                            <Label>Temperatura</Label>
                            <Slider
                                min={0}
                                max={1}
                                step={0.1}
                                value={[temperature]}
                                onValueChange={value => setTemperature(value[0])}
                            />
                            <span className='text-xs text-muted-foreground italic block leading-relaxed'>Valores mais altos tendem a deixar o resultado mais criativo e com possíveis erros.</span>
                        </div>

                        <Separator />

                        <Button disabled={isLoading} type='submit' className='w-full'>
                            Executar
                            <Wand2 className='w-4 h-4 ml-2' />
                        </Button>
                    </form>
                </aside>
            </main>
		</div>
	)
}
