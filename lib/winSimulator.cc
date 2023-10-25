#include <napi.h>
#include <windows.h>

using namespace Napi;

Napi::Value motionEvent(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    int x = info[0].As<Napi::Number>().Int32Value();
    int y = info[1].As<Napi::Number>().Int32Value();
    int wWidth = info[2].As<Napi::Number>().Int32Value();
    int wHeight = info[3].As<Napi::Number>().Int32Value();
    HWND hwnd = (HWND)info[4].As<Napi::Number>().Int64Value();

    HMONITOR hmonitor = MonitorFromWindow(hwnd, MONITOR_DEFAULTTONEAREST);
    MONITORINFO hinfo;
    hinfo.cbSize = sizeof ( MONITORINFO );
    if(GetMonitorInfoA(hmonitor, &hinfo) == 0){
      return env.Null();
    }

    // SystemParametersInfoA(SPI_SETWORKAREA, 0, &(hinfo.rcWork), 0);
    // printf("hinfo left: %d, right: %d,  top: %d, bottom: %d\n", hinfo.rcMonitor.left, hinfo.rcMonitor.right, hinfo.rcMonitor.top, hinfo.rcMonitor.bottom);

    // POINT a;
    // GetPhysicalCursorPos(&a);
    // printf("ax: %d, ay: %d ", a.x, a.y);

    int px = x * (hinfo.rcMonitor.right - hinfo.rcMonitor.left) / wWidth;
    int py = y * (hinfo.rcMonitor.bottom - hinfo.rcMonitor.top) / wHeight;
    printf("x: %d, y: %d vw: %d, vh: %d, sw: %d, sh: %d  ", x, y, wWidth, wHeight, hinfo.rcMonitor.right - hinfo.rcMonitor.left, hinfo.rcMonitor.bottom - hinfo.rcMonitor.top);
    printf("current x: %d, y: %d\n", px, py);
    SetCursorPos(px, py);

    return env.Null();
}

Napi::Value motionEventWID(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    int x = info[0].As<Napi::Number>().Int32Value();
    int y = info[1].As<Napi::Number>().Int32Value();
    int wWidth = info[2].As<Napi::Number>().Int32Value();
    int wHeight = info[3].As<Napi::Number>().Int32Value();
    HWND hwnd = (HWND)info[4].As<Napi::Number>().Int64Value();

    RECT rect;
    GetWindowRect(hwnd, &rect);
    int px = rect.left + (x* (rect.right-rect.left) / wWidth);
    int py = rect.top + (y * (rect.bottom - rect.top) / wHeight);
    // printf("x: %d, y: %d vw: %d, vh: %d ", x, y, wWidth, wHeight);
    // printf("current x: %d, y: %d\n", px, py);
    SetCursorPos(px, py);

    return env.Null();
}

Napi::Value buttonEvent(const Napi::CallbackInfo &info)
{
    Napi::Env env = info.Env();

    int buttonMask = info[0].As<Napi::Number>().Int32Value();
        bool down = info[1].As<Napi::Boolean>().Value();
    
        if (buttonMask == 0x10)
        {
            // printf("scroll down \n");

            INPUT mouseScroll;
            mouseScroll.type = INPUT_MOUSE;
            // mouseScroll.mi.dx = 0;
            // mouseScroll.mi.dy = 0;
            // mouseScroll.mi.time = 0;
            // mouseScroll.mi.dwExtraInfo = 0;
            mouseScroll.mi.dwFlags = MOUSEEVENTF_WHEEL;
            mouseScroll.mi.mouseData = -100;
            SendInput(1, &mouseScroll, sizeof(mouseScroll));

        }
        else if (buttonMask == 0x8)
        {
            // printf("scroll up \n");
            
            INPUT mouseScroll;
            mouseScroll.type = INPUT_MOUSE;
            // mouseScroll.mi.dx = 0;
            // mouseScroll.mi.dy = 0;
            // mouseScroll.mi.time = 0;
            // mouseScroll.mi.dwExtraInfo = 0;
            mouseScroll.mi.dwFlags = MOUSEEVENTF_WHEEL;
            mouseScroll.mi.mouseData = 100;
            SendInput(1, &mouseScroll, sizeof(mouseScroll));
        }
        else if (buttonMask == 0x4)
        {
          INPUT mouseInput;
          mouseInput.type = INPUT_MOUSE;
          // mouseInput.mi.mouseData = 0;
          // mouseInput.mi.dx = 0;
          // mouseInput.mi.dy = 0;
          // mouseInput.mi.time = 0;
          mouseInput.mi.dwFlags = down ? MOUSEEVENTF_RIGHTDOWN : MOUSEEVENTF_RIGHTUP;
          SendInput(1, &mouseInput, sizeof(mouseInput));

          // printf("right click \n");
        }
        else if (buttonMask == 0x2)
        {
          INPUT mouseInput;
          mouseInput.type = INPUT_MOUSE;
          // mouseInput.mi.mouseData = 0;
          // mouseInput.mi.dx = 0;
          // mouseInput.mi.dy = 0;
          // mouseInput.mi.time = 0;
          mouseInput.mi.dwFlags = down ? MOUSEEVENTF_MIDDLEDOWN : MOUSEEVENTF_MIDDLEUP;
          SendInput(1, &mouseInput, sizeof(mouseInput));

          // printf("middle click \n");
        }
        else if (buttonMask == 0x1)
        {
          INPUT mouseInput;
          mouseInput.type = INPUT_MOUSE;
          // mouseInput.mi.mouseData = 0;
          // mouseInput.mi.dx = 0;
          // mouseInput.mi.dy = 0;
          // mouseInput.mi.time = 0;
          mouseInput.mi.dwFlags = down ? MOUSEEVENTF_LEFTDOWN : MOUSEEVENTF_LEFTUP;
          SendInput(1, &mouseInput, sizeof(mouseInput));

          // printf("left click \n");
        }

    return env.Null();
}

Napi::Value keyEvent(const Napi::CallbackInfo &info)
{
   Napi::Env env = info.Env();

  const SHORT key = info[0].As<Napi::Number>().Int64Value();
  bool down = info[1].As<Napi::Boolean>().Value();
  DWORD flags = down ? 0 : KEYEVENTF_KEYUP;
  UINT scan = MapVirtualKey(key & 0xff, MAPVK_VK_TO_VSC);

	/* Set the scan code for extended keys */
	switch (key)
	{
    case VK_CONTROL:
    case VK_LMENU:
    //
    case VK_RCONTROL:
    case VK_SNAPSHOT: /* Print Screen */
    case VK_RMENU:	  /* Right Alt / Alt Gr */
    case VK_PAUSE:	  /* Pause / Break */
    case VK_HOME:
    case VK_UP:
    case VK_PRIOR: /* Page up */
    case VK_LEFT:
    case VK_RIGHT:
    case VK_END:
    case VK_DOWN:
    case VK_NEXT: /* 'Page Down' */
    case VK_INSERT:
    case VK_DELETE:
    case VK_LWIN:
    case VK_RWIN:
    case VK_APPS: /* Application */
    case VK_VOLUME_MUTE:
    case VK_VOLUME_DOWN:
    case VK_VOLUME_UP:
    case VK_MEDIA_NEXT_TRACK:
    case VK_MEDIA_PREV_TRACK:
    case VK_MEDIA_STOP:
    case VK_MEDIA_PLAY_PAUSE:
    case VK_BROWSER_BACK:
    case VK_BROWSER_FORWARD:
    case VK_BROWSER_REFRESH:
    case VK_BROWSER_STOP:
    case VK_BROWSER_SEARCH:
    case VK_BROWSER_FAVORITES:
    case VK_BROWSER_HOME:
    case VK_LAUNCH_MAIL:
    {
      flags |= KEYEVENTF_EXTENDEDKEY;
      break;
    }
	}

  INPUT keyboardInput;
	keyboardInput.type = INPUT_KEYBOARD;
	keyboardInput.ki.wScan = (WORD)scan;
	keyboardInput.ki.wVk = (WORD)key;
	keyboardInput.ki.dwFlags = KEYEVENTF_SCANCODE | flags;
	keyboardInput.ki.time = 0;
	SendInput(1, &keyboardInput, sizeof(keyboardInput));

  return env.Null();
}

Napi::Object Init(Napi::Env env, Napi::Object exports) {
  exports.Set(Napi::String::New(env, "motionEvent"),
                Napi::Function::New(env, motionEvent));
  exports.Set(Napi::String::New(env, "motionEventWID"),
                Napi::Function::New(env, motionEventWID));
  exports.Set(Napi::String::New(env, "buttonEvent"),
                Napi::Function::New(env, buttonEvent));
  exports.Set(Napi::String::New(env, "keyEvent"),
                Napi::Function::New(env, keyEvent));
  return exports;
}

NODE_API_MODULE(winSimulator, Init);