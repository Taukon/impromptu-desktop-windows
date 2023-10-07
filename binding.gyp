{
  "targets": [
    {
        "target_name": "winSimulator",
        "sources": ["lib/winSimulator.cc"],
        "include_dirs": [
            "<!@(node -p \"require('node-addon-api').include\")"
        ],
        'defines': ['NAPI_DISABLE_CPP_EXCEPTIONS'],
        'win_delay_load_hook': 'true'
    }
  ]
}