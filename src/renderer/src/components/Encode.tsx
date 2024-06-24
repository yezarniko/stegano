import ChooseFileIcon from '@/assets/chooseFile.png'
import ChooseImgIcon from '@/assets/chooseImg.png'
import EyeClosedIcon from '@/assets/eye-close.png'
import EyeIcon from '@/assets/eye.png'
import FilesIcon from '@/assets/files.svg'
import PasswordIcon from '@/assets/passwordIcon.png'
import Thumbnail from '@/assets/thumbnail.png'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'

export const ACCEPT_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export interface FileWithPath extends File {
  path: string
}

type MetaData = {
  id: number
  fileSize: string
  size: string
  bitsPerPixel: string
  colorMode: string
}

type MSE_PSNR = {
  id: number
  filesize: string
  mse: string
  psnr: string
}

export function shortenName(name: string, max: number, slice: number) {
  if (name.length > max) {
    return name.slice(0, slice) + '...' + name.slice(name.lastIndexOf('.') - 3)
  } else {
    return name
  }
}

function Encode() {
  const [loading, setLoading] = useState(false)
  const [imgLoading, setImgLoading] = useState(false)
  const [currentImage, setCurrentImage] = useState('')
  const [currentImageFile, setCurrentImageFile] = useState<FileWithPath | null>(null)
  const [currentSecretFile, setCurrentSecretFile] = useState<FileWithPath | null>(null)
  const [encryptedImage, setEncryptedImage] = useState('')
  const [metaData, setMetaData] = useState<MetaData | null>(null)
  const [isLargeFile, setIsLargeFile] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isPasswordMatch, setIsPasswordMatch] = useState(false)
  const [mse_psnr, setMSE_PSNR] = useState<MSE_PSNR | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  function openFileHandler() {
    if (fileInputRef.current && fileInputRef.current.files) {
      const currentFile = fileInputRef.current.files[0] as FileWithPath
      if (ACCEPT_FILE_TYPES.find((type) => type === currentFile.type)) {
        setCurrentImageFile(currentFile)
      }
    }
  }

  function encryptFile() {
    if (currentImageFile && currentSecretFile && !isLargeFile) {
      window.context.runPython([
        'encode.py',
        currentImageFile.path,
        currentSecretFile.path,
        password
      ])
      setLoading(true)
    } else {
      console.log('Ohh!')
    }
  }

  useEffect(() => {
    if (currentImageFile) {
      if (currentImageFile.path) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setCurrentImage(reader.result as string)
          setImgLoading(false)
        }
        setImgLoading(true)
        reader.readAsDataURL(currentImageFile)

        window.context.runPython(['getImageMetaData.py', currentImageFile.path])
        window.context.onPythonResponse((response) => {
          const data = JSON.parse(response)
          switch (data.id) {
            case 0:
              setMetaData(data)
              break
            case 1:
              setEncryptedImage(data.encryptedImgPath)
              setLoading(false)
              break
            case 3:
              setMSE_PSNR(data)
              break
            default:
              break
          }
        })
      }
    }
  }, [currentImageFile])

  useEffect(() => {
    if (password !== '' || confirmPassword !== '') {
      setIsPasswordMatch(password === confirmPassword)
    }
  }, [password, confirmPassword])

  return (
    <div className=" w-full h-full flex">
      {loading && <Loading />}
      <div className="w-1/3 min-w-96  h-full flex flex-col justify-center items-center  bg-slate-100 dark:bg-slate-900">
        <div
          onClick={() => !imgLoading && fileInputRef.current?.click()}
          className={clsx(
            'w-4/6 aspect-square bg-slate-50 dark:bg-slate-800 border-4 border-slate-400 flex flex-col items-center',
            'justify-center cursor-pointer  scale-90 mt-20',
            { 'border-dashed': !currentImage, 'rounded-xl': !currentImage }
          )}
        >
          {currentImage == '' ? (
            <>
              <img src={ChooseImgIcon} className="inline-block w-1/6 mb-5" />
              <h2 className="font-bold text-lg text-[#7C8EEE] ">Choose Cover Image</h2>
            </>
          ) : (
            <img src={currentImage} className="w-full h-full object-cover" />
          )}
          <input
            type="file"
            accept={ACCEPT_FILE_TYPES.join(' ')}
            className="hidden"
            ref={fileInputRef}
            onChange={openFileHandler}
            multiple={false}
          />
        </div>
        <div className="w-4/6  scale-90 backdrop-blur-lg border-2 rounded-2xl border-slate-400/50 dark:bg-slate-800/50 p-3">
          <table className="table-auto">
            <tbody>
              <tr>
                <td className="px-4 py-2">File Size:</td>
                <td className="px-4 py-2">{metaData ? metaData?.fileSize : '-'}</td>
              </tr>
              <tr>
                <td className="px-4 py-2">Image Size:</td>
                <td className="px-4 py-2">{metaData ? metaData?.size : '-'}</td>
              </tr>
              <tr>
                <td className="px-4 py-2">Pixels:</td>
                <td className="px-4 py-2">
                  {metaData
                    ? metaData?.size
                        .split('x')
                        .reduce((x, y) => `${parseInt(x) * parseInt(y)} pixels`)
                    : '-'}
                </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Bits Per Pixel:</td>
                <td className="px-4 py-2">{metaData ? metaData?.bitsPerPixel : '-'} </td>
              </tr>
              <tr>
                <td className="px-4 py-2">Color Mode:</td>
                <td className="px-4 py-2">{metaData ? metaData?.colorMode : '-'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-1/3 min-w-96 h-full flex flex-col pb-24 justify-center items-center  bg-slate-200 dark:bg-slate-800 ">
        <div className=" w-5/6 pt-20  ">
          <h2 className="font-bold text-lg ml-4 dark:text-[#7C8EEE] mb-6">Choose Secret File</h2>
          <FileChooser
            imageFile={currentImageFile}
            currentFile={currentSecretFile}
            setCurrentFile={setCurrentSecretFile}
            isLargeFile={isLargeFile}
            setIsLargeFile={setIsLargeFile}
            metaData={metaData}
          />
        </div>
        <div className=" w-5/6 pt-20">
          <h2 className="font-bold text-lg ml-4 dark:text-[#7C8EEE] mb-6">Password</h2>
          <PasswordInput
            placeholder="Create New Passsword"
            password={password}
            setPassword={setPassword}
          />
          <PasswordInput
            placeholder="Confirm Password"
            password={confirmPassword}
            setPassword={setConfirmPassword}
          />
          <Button
            label="Encode"
            clickHandler={encryptFile}
            enable={
              Boolean(currentImageFile) &&
              Boolean(currentSecretFile) &&
              !isLargeFile &&
              isPasswordMatch
            }
          />
        </div>
      </div>
      <div className="w-2/5 h-full bg-slate-300/15 flex items-center justify-center">
        {!loading && (
          <>
            <OutputImage encryptedImage={encryptedImage} />
            <MSE_PSNR
              value={mse_psnr}
              originalImage={currentImageFile ? currentImageFile.path : ''}
              testImage={encryptedImage}
            />
          </>
        )}
      </div>
    </div>
  )
}

export function PasswordInput(props: {
  placeholder: string
  password: string
  setPassword: React.Dispatch<React.SetStateAction<string>>
}) {
  const [inputType, setInputType] = useState('password')
  return (
    <div className="relative">
      <img src={PasswordIcon} className="w-10 absolute z-10 left-4 top-1 mt-0.5 p-1" />
      <input
        type={inputType}
        value={props.password}
        className="w-80 px-5 py-3 mb-5 text-center font-bold caret-slate-500 dark:caret-slate-300 dark:bg-slate-800 rounded-xl scale-95 border-slate-300  border-2 outline-none"
        onChange={(e) => props.setPassword(e.target.value)}
        placeholder={props.placeholder}
      />
      <img
        onClick={() =>
          setInputType((currentType) => (currentType === 'text' ? 'password' : 'text'))
        }
        src={inputType === 'password' ? EyeClosedIcon : EyeIcon}
        className="w-10 absolute z-10 left-64 top-1 mt-0.5 p-1 ml-2 cursor-pointer dark:brightness-110"
      />
    </div>
  )
}

export function FileChooser(props: {
  imageFile: FileWithPath | null
  currentFile: FileWithPath | null
  setCurrentFile: React.Dispatch<React.SetStateAction<FileWithPath | null>>
  isLargeFile: boolean
  setIsLargeFile: React.Dispatch<React.SetStateAction<boolean>>
  metaData: MetaData | null
}) {
  const fileRef = useRef<HTMLInputElement | null>(null)

  function convertBytes(size: number) {
    // Array of units
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB']

    // Iterate over the units
    for (let i = 0; i < units.length; i++) {
      // If size is less than 1000, return the formatted string
      if (size < 1000.0) {
        return `${size.toFixed(1)} ${units[i]}`
      }
      // Otherwise, divide the size by 1000
      size /= 1000.0
    }
    return ''
  }

  useEffect(() => {
    if (props.currentFile && props.metaData) {
      const [width, height] = props.metaData.size.split('x')
      console.log(props.metaData.size)
      console.log(width, height)
      props.setIsLargeFile(props.currentFile.size >= parseInt(width) * parseInt(height))
    }
  }, [props.currentFile, props.imageFile])

  return (
    <div className="flex items-center">
      <div
        onClick={() => fileRef.current?.click()}
        className={clsx(
          'min-w-60 w-2/4 bg-slate-100 dark:bg-slate-700 px-4 py-2 rounded-3xl box-content cursor-pointer  border-2 scale-90 hover:scale-95 text-nowrap overflow-hidden',
          props.isLargeFile ? 'border-red-300 dark:border-red-500' : 'border-slate-300'
        )}
      >
        <img src={ChooseFileIcon} className="inline-block w-1/5 mr-3" />
        <span className="font-bold text-base">
          {props.currentFile ? shortenName(props.currentFile.name, 15, 10) : 'Add Secret File'}
        </span>
      </div>
      {props.currentFile && (
        <h2 className={clsx(props.isLargeFile ? 'text-red-400 dark:text-red-500 font-bold' : '')}>
          {convertBytes(props.currentFile.size)}
        </h2>
      )}
      <input
        type="file"
        multiple={false}
        className="hidden"
        ref={fileRef}
        onChange={() => {
          if (fileRef.current?.files) {
            props.setCurrentFile(fileRef.current.files[0] as FileWithPath)
          }
        }}
      />
    </div>
  )
}

export function Button(props: {
  label: string
  clickHandler: React.MouseEventHandler<HTMLButtonElement>
  enable: boolean
}) {
  return (
    <button
      onClick={props.clickHandler}
      className={clsx(
        'py-2 scale-95 min-w-80    font-bold border-2 dark:border-slate-500 rounded-lg',
        props.enable
          ? 'text-[#7C8EEE] hover:border-slate-700 bg-slate-900 cursor-pointer'
          : 'text-slate-700 bg-slate-800'
      )}
      disabled={!props.enable}
    >
      {props.label}
    </button>
  )
}

function Loading() {
  return (
    <div className="absolute inset-0 scale-[.55] backdrop-blur-lg border-2 rounded-2xl border-slate-400/50 dark:bg-slate-800/50 bg-slate-200/60 z-20 flex items-center justify-between">
      <img src={FilesIcon} className="w-1/2 scale-50 animate-translateRight_en" />
      <img src={Thumbnail} className="w-1/2 scale-[.4]" />
      <div className="absolute bottom-32 inset-x-0 text-center font-bold text-3xl">
        Encoding ...
      </div>
    </div>
  )
}
function OutputImage(props: { encryptedImage: string }) {
  return (
    <div
      className={clsx(
        'group w-2/5 min-w-50 aspect-square bg-slate-50 dark:bg-slate-800 border-4  border-slate-400 flex flex-col items-center justify-center cursor-pointer  scale-90 mr-2',
        props.encryptedImage === '' && 'border-dashed rounded-xl'
      )}
    >
      <button
        // onClick={() => window.context.saveImage(props.encryptedImage)}
        className={clsx(
          props.encryptedImage && 'group-hover:block',
          'hidden  w-1/2 min-w-24 text-nowrap bg-slate-900 text-[#7C8EEE] p-2 rounded-2xl font-bold text-xs scale-95 absolute'
        )}
      >
        <a href={'file://' + props.encryptedImage} download={true}>
          Save Image
        </a>
      </button>
      {props.encryptedImage !== '' ? (
        <img src={'file://' + props.encryptedImage} className="w-full aspect-square object-cover" />
      ) : (
        <h2
          className={clsx(
            props.encryptedImage && 'group-hover:hidden',
            ' font-bold text-lg text-[#7C8EEE]'
          )}
        >
          Encoded Image
        </h2>
      )}
    </div>
  )
}

function MSE_PSNR(props: { value: MSE_PSNR | null; originalImage: string; testImage: string }) {
  useEffect(() => {
    console.log(props.value)
  }, [props.value])
  return (
    <>
      <div className="w-2/6 scale-95 font-bold flex flex-col">
        <div className="flex justify-between mb-2 ml-1">
          <h2>Size</h2>
          <span className="text-purple-500">{props.value ? props.value.filesize : '-'}</span>
        </div>
        <div className="flex justify-between mb-2 ml-1">
          <h2>MSE</h2>
          <span className="text-purple-500">{props.value ? props.value.mse : '0.00'}</span>
        </div>

        <div className="flex justify-between mb-5 ml-1">
          <h2>PSNR</h2>
          <span className="text-purple-500">{props.value ? props.value.psnr : '0.00'}</span>
        </div>
        <button
          onClick={() => {
            if (props.originalImage != '' && props.testImage != '') {
              console.log(props.originalImage)
              console.log(props.testImage)
              window.context.runPython(['mse_psnr.py', props.originalImage, props.testImage])
            }
          }}
          className="w-1/2 min-w-20 bg-slate-900 text-[#7C8EEE] p-2 mb-3 rounded-xl font-bold text-xs scale-95"
        >
          Calculate
        </button>
      </div>
    </>
  )
}

export default Encode
