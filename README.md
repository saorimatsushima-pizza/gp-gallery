# Pizzapatch-in — Chaos Gallery Demo

社内イベント向けチェックイン体験を、展示用に再構成した完全静的デモです。

- 実在する会社・組織・個人の情報は含みません
- サーバー側の処理や外部サービスへの接続はありません
- 入力・チェックイン結果は保存も送信もされません

## 開き方

`gallery/index.html` をブラウザで直接開いてください。静的ホスティングにもそのまま配置できます。

## 構成

```text
gallery/
├── index.html
├── styles.css
├── app.js
└── assets/
    ├── fredoka-one.ttf   # Fredoka One (SIL OFL 1.1)
    ├── OFL.txt           # 上記フォントのライセンス
    ├── icon-32/180/192/512.png
    └── ogp.jpg
```

## 公開前チェック

このデモのファイルだけを公開対象にし、秘密情報や実データを追加しないでください。
