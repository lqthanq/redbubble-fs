# import sys

# import uiautomator2 as u2
# from constants import CONTENT_TYPE

# from scripts import comment_post, comment_reel, create_post, create_reel, go_home, go_reel, like_post, like_reel, share_post, share_reel, swipe_page

# APP_ID = 'com.instagram.android'
# # simple argument echo script
# ip = ""
# for v in sys.argv[1:]:
#     ip = v
#     print(v)

# # d = u2.connect_adb_wifi(ip)
# # d = u2.connect("192.168.1.45:8999")

# try:
#     d = u2.connect_adb_wifi("192.168.147.5:8999")
# except:
#     print('Something wrong.')
# else:
#     print('else')

# # # Stop
# # d.app_stop(APP_ID)

# # d.app_start(APP_ID)

# # caption = 'play with mom so fun 🥰🥰 #bassethound,#bassethoundsofinstagram,#bassethoundmoments,#bassethounds'
# # create_reel(d, caption, '𝟡𝟘𝕤𝕥𝕖𝕥𝕙𝕚𝕔')
# # print(caption)
# # go_home(d)
# # go_reel(d)
# # swipe_page(d, CONTENT_TYPE["Post"])

# # like_post(d)
# # like_reel(d)
# # cmt = """Get a husky they said 🤦🏻‍♀️ #Huskydrama
# # #fyp #foryoupage #foryou #trending"""
# # share_reel(d, 5, cmt)

# # allow_permission(d)


username = input("Enter username:")
print("Username is: " + username)

"""
    File handling is an important part of any web application.
    Python has several functions for creating, reading, updating, and deleting files.

    # File Handling
    The key function for working with file in Python is the `open()` function.

    The `open()` function takes two parameters; filename, and mode.

    There 
"""