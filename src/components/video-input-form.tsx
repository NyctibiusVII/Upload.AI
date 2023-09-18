import {
    ChangeEvent,
    FormEvent,
    useMemo,
    useRef,
    useState
} from 'react'

import { Textarea }  from './ui/textarea'
import { Button }    from './ui/button'
import { Label }     from './ui/label'
import { Separator } from './ui/separator'

import {
    FileVideo,
    Upload
} from 'lucide-react'

import { getFFmpeg } from '@/lib/ffmpeg'
import { fetchFile } from '@ffmpeg/util'
import { api }       from '@/lib/axios'

interface VideoInputFormProps {
    onVideoUploaded: (videoId: string) => void
}

type Status = 'waiting' | 'converting' | 'uploading' | 'generating' | 'success' | 'again' | 'error'

const statusMessage = {
    converting: 'Convertendo...',
    uploading: 'Carregando...',
    generating: 'transcrevendo...',
    success: 'Sucesso!',
    again: 'Tente novamente!',
    error: 'Erro!',
}

export function VideoInputForm(props: VideoInputFormProps) {
    const [videoFile, setVideoFile] = useState<File | null>(null)
    const [status, setStatus] = useState<Status>('waiting')

    const promptInputRef = useRef<HTMLTextAreaElement>(null)

    function handleFileSelect(event: ChangeEvent<HTMLInputElement>) {
        const { files } = event.currentTarget

        if (!files) return

        const selectedFile = files[0]
        setVideoFile(selectedFile)
    }

    async function convertVideoToAudio(video: File) {
        const ffmpeg = await getFFmpeg()

        await ffmpeg.writeFile('input.mp4', await fetchFile(video))

        ffmpeg.on('progress', progess => {
            console.log('Convert progess:', Math.round(progess.progress * 100))
        })

        ffmpeg.exec([
            '-i',
            'input.mp4',
            '-map',
            '0:a',
            '-b:a',
            '20k',
            '-acodec',
            'libmp3lame',
            'output.mp3'
        ])

        const data = await ffmpeg.readFile('output.mp3')
        const audioFileBlob = new Blob([data], { type: 'audio/mpeg' })
        const audioFile = new File([audioFileBlob], 'audio.mp3', { type: 'audio/mp3' })

        return audioFile
    }

    async function handleUploadVideo(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        try {
            const prompt = promptInputRef.current?.value

            if (!videoFile) return

            setStatus('converting')

            const audioFile = await convertVideoToAudio(videoFile)

            const data = new FormData()
            data.append('file', audioFile)

            setStatus('uploading')

            const response = await api.post('/videos', data)

            const videoId = response.data.video.id

            setStatus('generating')

            await api.post(`videos/${videoId}/transcription`, { prompt })

            setStatus('success')

            props.onVideoUploaded(videoId)
        }
        catch (error) {
            console.error(error)
            setStatus('error')
            setTimeout(() => setStatus('again'), 3000)
        }
    }

    const previewURL = useMemo(() => {
        if (!videoFile) return null

        return URL.createObjectURL(videoFile)
    }, [videoFile])

    return (
        <form onSubmit={handleUploadVideo} className='space-y-6'>
            <label
                htmlFor='video'
                className='relative text-sm text-muted-foreground border border-dashed rounded-md flex flex-col items-center justify-center gap-2 aspect-video overflow-hidden object-cover cursor-pointer hover:bg-primary/5'
            >
                { previewURL ?
                    <video src={previewURL} controls={false} className='pointer-events-none absolute inset-0' />
                :
                    <>
                        <FileVideo className='w-4 h-4' />
                        Selecione um video
                    </>
                }
            </label>
            <input id='video' type='file' accept='video/mp4' className='sr-only' onChange={handleFileSelect} />

            <Separator />

            <div className='space-y-2'>
                <Label htmlFor='transcription_prompt'>Prompt de transcrição</Label>
                <Textarea
                    id='transcription_prompt'
                    ref={promptInputRef}
                    disabled={status !== 'waiting' && status !== 'again'}
                    className='min-h-[4rem] leading-relaxed'
                    placeholder='Inclua palavras chaves mencionadas no video separadas por vírgula (,)'
                />
                <Button
                    type='submit'
                    className='w-full data-[success=true]:bg-emerald-400 data-[error=true]:bg-red-400'
                    disabled={status !== 'waiting' && status !== 'again'}
                    data-success={status === 'success'}
                    data-error={status === 'error'}
                >
                    { status === 'waiting' ?
                        <>
                            Carregar video
                            <Upload className='w-4 h-4 ml-2' />
                        </>
                    :
                        statusMessage[status]
                    }
                </Button>
            </div>
        </form>
    )
}