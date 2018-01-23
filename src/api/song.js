import {commonParams} from './config'
import axios from 'axios'
// 获取歌词
export function getLyric(mid) {
  const url = '/api/lyric'
  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
export function getVkey(songmid) {
  const url = '/api/vkey'
  const data = {
    songmid: songmid,
    cid: 205361747,
    guid: 3655047200,
    uin: 0,
    filename: 'C400' + songmid + '.m4a',
    platform: 'yqq',
    inCharset: 'utf8',
    outCharset: 'utf8',
    g_tk: '1278911659',
    hostUin: 0,
    notice: 0,
    needNewCode: 0,
    format: 'json'
  }
  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
