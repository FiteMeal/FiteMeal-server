import  dayjs from 'dayjs'
import timezone from 'dayjs/plugin/timezone'
import  utc from 'dayjs/plugin/utc'

dayjs.extend(utc)
dayjs.extend(timezone)
dayjs.tz.setDefault('Asia/Jakarta')

const x = dayjs()
console.log(x,"<<<<");


export default dayjs