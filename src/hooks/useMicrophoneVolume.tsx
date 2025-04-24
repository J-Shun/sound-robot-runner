import { useEffect, useRef, useState } from 'react';

export function useMicrophoneVolume() {
  // 用於儲存計算出的麥克風音量的狀態
  const [volume, setVolume] = useState(0);

  // 用於儲存 AnalyserNode 的參考
  const analyserRef = useRef<AnalyserNode | null>(null);

  // 用於儲存音頻數據的 Uint8Array 的參考
  const dataArrayRef = useRef<Uint8Array | null>(null);

  useEffect(() => {
    async function init() {
      // 請求使用者的麥克風權限並獲取音頻流
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // 建立音頻上下文，用於處理音頻數據
      const audioContext = new AudioContext();

      // 將麥克風音頻流轉換為音頻源
      const source = audioContext.createMediaStreamSource(stream);

      // 建立 AnalyserNode，用於分析音頻數據
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256; // 設定 FFT 大小，用於頻率分析

      // 建立一個 Uint8Array，用於存儲時間域音頻數據
      const dataArray = new Uint8Array(analyser.frequencyBinCount);

      // 將 analyser 和 dataArray 儲存到參考中，方便後續使用
      analyserRef.current = analyser;
      dataArrayRef.current = dataArray;

      // 將音頻源連接到分析器
      source.connect(analyser);

      // 定義一個函數，用於持續計算並更新音量
      const loop = () => {
        if (analyserRef.current && dataArrayRef.current) {
          // 從分析器中獲取時間域音頻數據
          analyserRef.current.getByteTimeDomainData(dataArrayRef.current);

          // 計算音頻數據的均方根值 (RMS)，用於表示音量
          let sum = 0;
          for (let i = 0; i < dataArrayRef.current.length; i++) {
            const val = dataArrayRef.current[i] - 128; // 將數據中心化到 0
            sum += val * val; // 將數據平方後累加
          }
          const vol = Math.sqrt(sum / dataArrayRef.current.length); // 計算 RMS 值

          // 更新音量狀態
          setVolume(vol);
        }

        // 使用 requestAnimationFrame 進行下一次迭代
        requestAnimationFrame(loop);
      };

      // 啟動音量計算循環
      loop();
    }

    // 初始化麥克風並開始處理音頻
    init();
  }, []);

  // 返回當前的音量值
  return volume;
}
