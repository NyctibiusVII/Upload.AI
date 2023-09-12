import {
    Github,
    FileVideo,
    Upload,
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

export function App() {
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
                        />
                        <Textarea
                            className='resize-none p-4 leading-relaxed'
                            placeholder='Resultado gerado pela IA...'
                            readOnly
                        />
                    </div>

                    <p className='text-sm text-muted-foreground'>
                        Lembre-se: Você pode utilizar a variável <code className='text-violet-400'>&#x0007B;transcription&#x0007D;</code> no seu prompt para adicionar o  conteúdo da transcrição do video selecionado.
                    </p>
                </div>

                <aside className='w-80 space-y-6'>
                    <form className='space-y-6'>
                        <label
                            htmlFor='video'
                            className='text-sm text-muted-foreground border border-dashed rounded-md flex flex-col items-center justify-center gap-2 aspect-video cursor-pointer hover:bg-primary/5'
                        >
                            <FileVideo className='w-4 h-4' />
                            Selecione um video
                        </label>
                        <input id='video' type='file' accept='video/mp4' className='sr-only' />

                        <Separator />

                        <div className='space-y-2'>
                            <Label htmlFor='transcription_prompt'>Prompt de transcrição</Label>
                            <Textarea
                                id='transcription_prompt'
                                className='min-h-[4rem] leading-relaxed'
                                placeholder='Inclua palavras chaves mencionadas no video separadas por vírgula (,)'
                            />
                            <Button type='submit' className='w-full'>
                                Carregar video
                                <Upload className='w-4 h-4 ml-2' />
                            </Button>
                        </div>
                    </form>

                    <Separator />

                    <form className='space-y-6'>
                        <div className='space-y-2'>
                            <Label>Prompt</Label>
                            <Select>
                                <SelectTrigger>
                                    <SelectValue placeholder='Selecione um prompt...' />
                                </SelectTrigger>

                                <SelectContent>
                                    <SelectItem value='titleYT'>Titulo do Youtube</SelectItem>
                                    <SelectItem value='descriptionYT'>Descrição do Youtube</SelectItem>
                                </SelectContent>
                            </Select>
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
                            />
                            <span className='text-xs text-muted-foreground italic block leading-relaxed'>Valores mais altos tendem a deixar o resultado mais criativo e com possíveis erros.</span>
                        </div>

                        <Separator />

                        <Button type='submit' className='w-full'>
                            Executar
                            <Wand2 className='w-4 h-4 ml-2' />
                        </Button>
                    </form>
                </aside>
            </main>
		</div>
	)
}
