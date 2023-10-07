import { KeyJson } from "../../../../util/type";

let alphanumeric = true; // capslock = true: A->あ, capslock = false: あ-> A

export const keySymToWin32Key = (
  keyJson: KeyJson,
): { code: number; down: boolean } | undefined => {
  const name = keyJson.key.name;
  const keyCode = keyJson.key.keyCode;
  const down = keyJson.key.down;
  if (name == "Control") {
    return { code: win32KeyList.VK_CONTROL, down: down };
  } else if (name == "Alt") {
    return { code: win32KeyList.VK_MENU, down: down };
  } else if (name == "Shift") {
    return { code: win32KeyList.VK_SHIFT, down: down };
  } else if (name == "Escape") {
    return { code: win32KeyList.VK_ESCAPE, down: down };
  } else if (name == "Enter") {
    return { code: win32KeyList.VK_RETURN, down: down };
  } else if (name == "Backspace") {
    return { code: win32KeyList.VK_BACK, down: down };
  } else if (name == "Tab") {
    return { code: win32KeyList.VK_TAB, down: down };
  } else if (name == "Home") {
    return { code: win32KeyList.VK_HOME, down: down };
  } else if (name == "End") {
    return { code: win32KeyList.VK_END, down: down };
  } else if (name == "PageUp") {
    return { code: win32KeyList.VK_PRIOR, down: down };
  } else if (name == "PageDown") {
    return { code: win32KeyList.VK_NEXT, down: down };
  } else if (name == "ArrowRight") {
    return { code: win32KeyList.VK_RIGHT, down: down };
  } else if (name == "ArrowLeft") {
    return { code: win32KeyList.VK_LEFT, down: down };
  } else if (name == "ArrowUp") {
    return { code: win32KeyList.VK_UP, down: down };
  } else if (name == "ArrowDown") {
    return { code: win32KeyList.VK_DOWN, down: down };
  } else if (name == "Insert") {
    return { code: win32KeyList.VK_INSERT, down: down };
  } else if (name == "Delete") {
    return { code: win32KeyList.VK_DELETE, down: down };
  } else if (name == " ") {
    return { code: win32KeyList.VK_SPACE, down: down };
  } else if (name == "CapsLock") {
    // CapsLock not work?
    // console.log(name)
    return { code: win32KeyList.VK_CAPITAL, down: down };
  } else if (name == "Alphanumeric") {
    if (alphanumeric) {
      // A->あ : u(240 t)
      if (down) {
        return { code: win32KeyList.VK_OEM_ATTN, down: down };
      } else {
        alphanumeric = !alphanumeric;
        return undefined;
      }
    } else {
      // あ->A : d(242 f) u(240 t)
      if (down) {
        return { code: win32KeyList.VK_OEM_ATTN, down: down };
      } else {
        alphanumeric = !alphanumeric;
        return { code: win32KeyList.VK_OEM_COPY, down: down };
      }
    }
  } else if (name == "Hankaku") {
    // A->あ : d:(243 f) u:(244 t)
    // あ->A : d(244 f) u(243 t)
    return down
      ? { code: win32KeyList.VK_OEM_AUTO, down: down }
      : { code: win32KeyList.VK_OEM_ENLW, down: down };
  } else if (name == "Zenkaku") {
    // A->あ : d:(243 f) u:(244 t)
    // あ->A : d(244 f) u(243 t)
    return down
      ? { code: win32KeyList.VK_OEM_AUTO, down: down }
      : { code: win32KeyList.VK_OEM_ENLW, down: down };
  } else if (name == "NonConvert") {
    //Muhenkan
    return { code: win32KeyList.VK_NONCONVERT, down: down };
  } else if (name == "Convert") {
    //Henkan
    return { code: win32KeyList.VK_CONVERT, down: down };
  } else if (name == "Hiragana") {
    return down
      ? { code: win32KeyList.VK_OEM_COPY, down: down }
      : { code: win32KeyList.VK_OEM_ATTN, down: down };
  }
  // 0xba : *
  else if (keyCode === 186) {
    return { code: win32KeyList.VK_OEM_1, down: down };
  }
  // 0xbb ; +
  else if (keyCode === 187) {
    return { code: win32KeyList.VK_OEM_PLUS, down: down };
  }
  // 0xbc , <
  else if (keyCode === 188) {
    return { code: win32KeyList.VK_OEM_COMMA, down: down };
  }
  // 0xbd - =
  else if (keyCode === 189) {
    return { code: win32KeyList.VK_OEM_MINUS, down: down };
  }
  // 0xbe . >
  else if (keyCode === 190) {
    return { code: win32KeyList.VK_OEM_PERIOD, down: down };
  }
  // 0xbf / ?
  else if (keyCode === 191) {
    return { code: win32KeyList.VK_OEM_2, down: down };
  }
  // 0xc0 @ `
  else if (keyCode === 192) {
    return { code: win32KeyList.VK_OEM_2, down: down };
  }
  // 0xdb [ {
  else if (keyCode === 219) {
    return { code: win32KeyList.VK_OEM_4, down: down };
  }
  // 0xdc \ |
  else if (keyCode === 220) {
    return { code: win32KeyList.VK_OEM_5, down: down };
  }
  // 0xdd ] }
  else if (keyCode === 221) {
    return { code: win32KeyList.VK_OEM_6, down: down };
  }
  // 0xde ^ ~
  else if (keyCode === 222) {
    return { code: win32KeyList.VK_OEM_7, down: down };
  }
  // 0xe2 \ _
  else if (keyCode === 226) {
    return { code: win32KeyList.VK_OEM_102, down: down };
  } else {
    const code = Object.values(win32KeyList).find((v) => v === keyCode);
    return code ? { code: code, down: down } : undefined;
  }
};

const win32KeyList = {
  VK_BACK: 0x08, //	Backspace キー
  VK_TAB: 0x09, //	Tab キー
  // -: 0x0A-0B	予約済み
  VK_CLEAR: 0x0c, //	Clear キー
  VK_RETURN: 0x0d, //	Enter キー
  // -: 0x0E-0F	[Unassigned] \(未割り当て)
  VK_SHIFT: 0x10, //	Shift キー
  VK_CONTROL: 0x11, //	Ctrl キー
  VK_MENU: 0x12, //	ALT キー
  VK_PAUSE: 0x13, //	Pause キー
  VK_CAPITAL: 0x14, //	CAPS LOCK キー
  VK_KANA: 0x15, //	IME かなモード
  VK_HANGUL: 0x15, //	IME ハングル モード
  VK_IME_ON: 0x16, //	IME オン
  VK_JUNJA: 0x17, //	IME Junja モード
  VK_FINAL: 0x18, //	IME Final モード
  VK_HANJA: 0x19, //	IME Hanja モード
  VK_KANJI: 0x19, //	IME 漢字モード
  VK_IME_OFF: 0x1a, //	IME オフ
  VK_ESCAPE: 0x1b, //	Esc キー
  VK_CONVERT: 0x1c, //	IME 変換
  VK_NONCONVERT: 0x1d, //	IME 無変換
  VK_ACCEPT: 0x1e, //	IME 使用可能
  VK_MODECHANGE: 0x1f, //	IME モード変更要求
  VK_SPACE: 0x20, //	Space キー
  VK_PRIOR: 0x21, //	PageUp キー
  VK_NEXT: 0x22, //	PageDown キー
  VK_END: 0x23, //	End キー
  VK_HOME: 0x24, //	Home キー
  VK_LEFT: 0x25, //	左方向キー
  VK_UP: 0x26, //	上方向キー
  VK_RIGHT: 0x27, //	右方向キー
  VK_DOWN: 0x28, //	下方向キー
  VK_SELECT: 0x29, //	Select キー
  VK_PRINT: 0x2a, //	Print キー
  VK_EXECUTE: 0x2b, //	Execute キー
  VK_SNAPSHOT: 0x2c, //	Print Screen キー
  VK_INSERT: 0x2d, //	Ins キー
  VK_DELETE: 0x2e, //	DEL キー
  VK_HELP: 0x2f, //	Help キー
  n0: 0x30, //	0 キー
  n1: 0x31, //	1 キー
  n2: 0x32, //	2 キー
  n3: 0x33, //	3 キー
  n4: 0x34, //	4 キー
  n5: 0x35, //	5 キー
  n6: 0x36, //	6 キー
  n7: 0x37, //	7 キー
  n8: 0x38, //	8 キー
  n9: 0x39, //	9 キー
  // -: 0x3A-40	未定義。
  A: 0x41, //	A キー
  B: 0x42, //	B キー
  C: 0x43, //	C キー
  D: 0x44, //	D キー
  E: 0x45, //	E キー
  F: 0x46, //	F キー
  G: 0x47, //	G キー
  H: 0x48, //	H キー
  I: 0x49, //	I キー
  J: 0x4a, //	J キー
  K: 0x4b, //	K キー
  L: 0x4c, //	L キー
  M: 0x4d, //	M キー
  N: 0x4e, //	N キー
  O: 0x4f, //	O キー
  P: 0x50, //	P キー
  Q: 0x51, //	Q キー
  R: 0x52, //	R キー
  S: 0x53, //	S キー
  T: 0x54, //	T キー
  U: 0x55, //	U キー
  V: 0x56, //	V キー
  W: 0x57, //	W キー
  X: 0x58, //	X キー
  Y: 0x59, //	Y キー
  Z: 0x5a, //	Z キー
  VK_LWIN: 0x5b, //	Windows の左キー
  VK_RWIN: 0x5c, //	右の Windows キー
  VK_APPS: 0x5d, //	アプリケーション キー
  // -: 0x5E	予約済み
  VK_SLEEP: 0x5f, //	コンピューターのスリープ キー
  VK_NUMPAD0: 0x60, //	テンキーの 0 キー
  VK_NUMPAD1: 0x61, //	テンキーの 1 キー
  VK_NUMPAD2: 0x62, //	テンキーの 2 キー
  VK_NUMPAD3: 0x63, //	テンキーの 3 キー
  VK_NUMPAD4: 0x64, //	テンキーの 4 キー
  VK_NUMPAD5: 0x65, //	テンキーの 5 キー
  VK_NUMPAD6: 0x66, //	テンキーの 6 キー
  VK_NUMPAD7: 0x67, //	テンキーの 7 キー
  VK_NUMPAD8: 0x68, //	テンキーの 8 キー
  VK_NUMPAD9: 0x69, //	テンキーの 9 キー
  VK_MULTIPLY: 0x6a, //	乗算キー
  VK_ADD: 0x6b, //	キーの追加
  VK_SEPARATOR: 0x6c, //	区切り記号キー
  VK_SUBTRACT: 0x6d, //	減算キー
  VK_DECIMAL: 0x6e, //	10 進キー
  VK_DIVIDE: 0x6f, //	除算キー
  VK_F1: 0x70, //	F1 キー
  VK_F2: 0x71, //	F2 キー
  VK_F3: 0x72, //	F3 キー
  VK_F4: 0x73, //	F4 キー
  VK_F5: 0x74, //	F5 キー
  VK_F6: 0x75, //	F6 キー
  VK_F7: 0x76, //	F7 キー
  VK_F8: 0x77, //	F8 キー
  VK_F9: 0x78, //	F9 キー
  VK_F10: 0x79, //	F10 キー
  VK_F11: 0x7a, //	F11 キー
  VK_F12: 0x7b, //	F12 キー
  VK_F13: 0x7c, //	F13 キー
  VK_F14: 0x7d, //	F14 キー
  VK_F15: 0x7e, //	F15 キー
  VK_F16: 0x7f, //	F16 キー
  VK_F17: 0x80, //	F17 キー
  VK_F18: 0x81, //	F18 キー
  VK_F19: 0x82, //	F19 キー
  VK_F20: 0x83, //	F20 キー
  VK_F21: 0x84, //	F21 キー
  VK_F22: 0x85, //	F22 キー
  VK_F23: 0x86, //	F23 キー
  VK_F24: 0x87, //	F24 キー
  // -: 0x88-8F	予約済み
  VK_NUMLOCK: 0x90, //	NUM LOCK キー
  VK_SCROLL: 0x91, //	ScrollLock キー
  // -: 0x92-96	OEM 固有
  // -: 0x97-9F	[Unassigned] \(未割り当て)
  VK_LSHIFT: 0xa0, //	左 Shift キー
  VK_RSHIFT: 0xa1, //	右 Shift キー
  VK_LCONTROL: 0xa2, //	左 Ctrl キー
  VK_RCONTROL: 0xa3, //	右 Ctrl キー
  VK_LMENU: 0xa4, //	左 Alt キー
  VK_RMENU: 0xa5, //	右 Alt キー
  VK_BROWSER_BACK: 0xa6, //	ブラウザーの戻るキー
  VK_BROWSER_FORWARD: 0xa7, //	ブラウザーの進むキー
  VK_BROWSER_REFRESH: 0xa8, //	ブラウザーの更新キー
  VK_BROWSER_STOP: 0xa9, //	ブラウザーの停止キー
  VK_BROWSER_SEARCH: 0xaa, //ブラウザーの検索キー
  VK_BROWSER_FAVORITES: 0xab, //	ブラウザーのお気に入りキー
  VK_BROWSER_HOME: 0xac, //	ブラウザーのスタートとホーム キー
  VK_VOLUME_MUTE: 0xad, //	音量ミュート キー
  VK_VOLUME_DOWN: 0xae, //	音量下げるキー
  VK_VOLUME_UP: 0xaf, //	音量上げるキー
  VK_MEDIA_NEXT_TRACK: 0xb0, //	次のトラックキー
  VK_MEDIA_PREV_TRACK: 0xb1, //	前のトラック
  VK_MEDIA_STOP: 0xb2, //	メディアの停止キー
  VK_MEDIA_PLAY_PAUSE: 0xb3, //	メディアの再生/一時停止キー
  VK_LAUNCH_MAIL: 0xb4, //	メール開始キー
  VK_LAUNCH_MEDIA_SELECT: 0xb5, //	メディアの選択キー
  VK_LAUNCH_APP1: 0xb6, //	アプリケーション 1 の起動キー
  VK_LAUNCH_APP2: 0xb7, //	アプリケーション 2 の起動キー
  // -: 0xB8-B9	予約済み
  VK_OEM_1: 0xba, //	その他の文字に使用されます。キーボードによって異なる場合があります。 米国標準キーボードの場合は、 ;: キー
  VK_OEM_PLUS: 0xbb, //	どの国/地域の場合でも + 、キー
  VK_OEM_COMMA: 0xbc, //	どの国/地域の場合でも , 、キー
  VK_OEM_MINUS: 0xbd, //	どの国/地域の場合でも - 、キー
  VK_OEM_PERIOD: 0xbe, //	どの国/地域の場合でも . 、キー
  VK_OEM_2: 0xbf, //	その他の文字に使用されます。キーボードによって異なる場合があります。 米国標準キーボードの場合は、 /? キー
  VK_OEM_3: 0xc0, //	その他の文字に使用されます。キーボードによって異なる場合があります。 米国標準キーボードの場合は、 `~ キー
  // -: 0xC1-DA	予約済み
  VK_OEM_4: 0xdb, //	その他の文字に使用されます。キーボードによって異なる場合があります。 米国標準キーボードの場合は、 [{ キー
  VK_OEM_5: 0xdc, //	その他の文字に使用されます。キーボードによって異なる場合があります。 米国標準キーボードの場合は、 \\| キー
  VK_OEM_6: 0xdd, //	その他の文字に使用されます。キーボードによって異なる場合があります。 米国標準キーボードの場合は、 ]} キー
  VK_OEM_7: 0xde, //	その他の文字に使用されます。キーボードによって異なる場合があります。 米国標準キーボードの場合は、 '" キー
  VK_OEM_8: 0xdf, //	その他の文字に使用されます。キーボードによって異なる場合があります。
  // -: 0xE0	予約済み
  // -: 0xE1	OEM 固有
  VK_OEM_102: 0xe2, //	標準的な US キーボードの <> キー、US 以外の 102 キー キーボードの \\| キー
  // -: 0xE3-E4	OEM 固有
  VK_PROCESSKEY: 0xe5, //	IME PROCESS キー
  // -: 0xE6	OEM 固有
  VK_PACKET: 0xe7, //	Unicode 文字がキーストロークであるかのように渡されます。 VK_PACKET キー値は、キーボード以外の入力手段に使用される 32 ビット仮想キー値の下位ワードです。 詳細については、KEYBDINPUT、SendInput、WM_KEYDOWN、WM_KEYUP の注釈を参照してください
  // -: 0xE8	[Unassigned] \(未割り当て)
  // -: 0xE9-F5	OEM 固有
  VK_ATTN: 0xf6, //	Attn キー
  VK_CRSEL: 0xf7, //	CrSel キー
  VK_EXSEL: 0xf8, //	ExSel キー
  VK_EREOF: 0xf9, //	EOF 消去キー
  VK_PLAY: 0xfa, //	再生キー
  VK_ZOOM: 0xfb, //	ズーム キー
  VK_NONAME: 0xfc, //	予約済み
  VK_PA1: 0xfd, //	PA1 キー
  VK_OEM_CLEAR: 0xfe, //	クリア キー

  // Capas Lock
  VK_OEM_ATTN: 240,
  VK_OEM_COPY: 242,

  // Hankaku/Zenkaku
  VK_OEM_AUTO: 243,
  VK_OEM_ENLW: 244,
};
