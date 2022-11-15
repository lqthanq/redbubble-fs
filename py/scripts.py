from datetime import datetime
import re
from time import sleep
from tkinter import NO
from typing import Optional, Union
from random import choice, randint

from uiautomator2 import Device, UiObject, xpath


from constants import (CAMERA_PATH, CONTENT_TYPE, MOVIES_IG_PATH, MOVIES_PATH,
                       PICTURES_IG_PATH, POST_FILTERS, REEL_FILTER)
from utils import (delete_all_files, fprint, get_file, go_home, go_reel, swipe_down,
                   swipe_up)


indexs = []
for i in range(1, 10):
    cur = 4 * i + 1
    nxt = cur + 3
    indexs.append("%s|%s" % (cur, nxt))


def create_post(d: Device, caption: Optional[str] = '', filter: Optional[str] = '') -> None:
    fprint('Create post start.')
    d(resourceId="com.instagram.android:id/action_bar_left_button").click()  # more action
    d(resourceId="com.instagram.android:id/overflow_menu_item_label",
      text="Post").click()  # Reel action

    # Select multiple
    d(resourceId="com.instagram.android:id/multi_select_slide_button_alt").click(5.0)

    # Seelct all files
    check_boxs = d(className="android.widget.CheckBox")
    if len(check_boxs) > 0:
        list_files = []
        list_files.extend(get_file(d, PICTURES_IG_PATH))
        list_files.extend(get_file(d, MOVIES_IG_PATH))
        list_files.extend(get_file(d, CAMERA_PATH))
        list_files.extend(get_file(d, MOVIES_PATH))

        len_list = len(list_files)
        if len_list > 0:
            special = False
            idx = 0
            for i in range(len(indexs)):
                index = indexs[i]

                pattern = r'\|'
                first, second = re.split(pattern, index)
                special = len_list > int(first) and len_list <= int(second)
                if special:
                    idx = int(first)
                    break

            for i in range(1, len_list):
                el: UiObject = check_boxs[i % 4]
                x, y = el.center()

                if i % 4 == 0:
                    x = 220
                    y = 1710

                if special:
                    if i == idx:
                        x = 480
                        y = 1710
                    elif i == idx + 1:
                        x = 740
                        y = 1710
                    elif i == idx + 2:
                        x = 1010
                        y = 1710

                d.click(x, y)

    fprint('Selected files.')
    # Next first
    d(resourceId="com.instagram.android:id/next_button_imageview").click(timeout=1.0)

    d(text="Continue").click_exists(1.5)

    # select filter
    if bool(filter) and filter in POST_FILTERS:
        fprint(f'Choose filter \"{filter}\" for post.')
        filter_index = 0
        # resourceId = "com.instagram.android:id/filter_picker"
        cls = "android.widget.HorizontalScrollView"
        filter_picker = d(className=cls)
        while filter_index < 6:
            filter_boxs = d.xpath(
                f'//*[@class="{cls}"]/android.widget.LinearLayout[1]/android.widget.FrameLayout')
            for f in filter_boxs.all():
                name = f.info['contentDescription']
                if name == filter:
                    f.click()
                    break
            else:
                filter_picker.swipe('left')
                filter_picker.swipe('left')
                filter_index += 1
                continue
            break

        fprint(f'Choose filter \"{filter}\" for post success.')

    # Next second
    next2 = d(
        resourceId="com.instagram.android:id/next_button_imageview").exists(1.5)
    if next2:
        # Multiple file type
        d(resourceId="com.instagram.android:id/next_button_imageview").click()
    else:
        d(text="Next").click(1.0)  # Only video

    d(text="OK", resourceId="com.instagram.android:id/bb_primary_action").click_exists(1.0)

    # d(className="android.widget.FrameLayout", resourceId="com.instagram.android:id/layout_container_main").child_by_text(
    #     'Remix for feed videos').child(resourceId="com.instagram.android:id/bb_primary_action").click()

    if bool(caption):
        fprint(f'Insert caption \"{caption}\" for post.')
        input_box = d(resourceId="com.instagram.android:id/caption_text_view")
        if bool(input_box) == False:
            swipe_up(d)
            input_box = d(
                resourceId="com.instagram.android:id/caption_text_view")

        input_box.click()
        d.set_fastinput_ime()

        sleep(1.0)
        d.send_keys(caption, True)
        d.set_fastinput_ime(False)
        d.keyevent('111')
        fprint(f'Insert caption \"{caption}\" for post success.')

    # Multiple img & video
    d(resourceId="com.instagram.android:id/next_button_imageview").click_exists(1.0)
    d(resourceId="com.instagram.android:id/post_button").click_exists(1.0)  # Only video

    progress_bar = d(
        resourceId="com.instagram.android:id/row_pending_media_progress_bar").exists(0.5)
    progress_index = 0
    fprint('Posting ...')
    while progress_bar and progress_bar < 10:
        progress_index += 1
        progress_bar = d(
            resourceId="com.instagram.android:id/row_pending_media_progress_bar").exists(0.5)

        if progress_bar == False:
            break

    fprint('Create a post success.')


def create_reel(d: Device, caption: Optional[str] = '', filter: Optional[str] = '', sticker: Optional[str] = '') -> None:
    fprint('Create reel.')
    d(resourceId="com.instagram.android:id/action_bar_left_button").click()  # more action

    d(resourceId="com.instagram.android:id/overflow_menu_item_label",
      text="Reel").click()  # Reel action

    d(resourceId="com.instagram.android:id/auxiliary_button_row").click_exists(1.0)

    d(resourceId="com.instagram.android:id/gallery_preview_button").click()  # gallery

    # multi select btn
    d(resourceId="com.instagram.android:id/gallery_menu_multi_select_button").click()

    # Select all files
    file_count = 0
    for elem in d.xpath('//*[@resource-id="com.instagram.android:id/gallery_grid_item_selection_circle"]').all():
        file_count += 1
        elem.click()

    fprint('Selected files.')
    # Next first
    d(resourceId="com.instagram.android:id/media_thumbnail_tray_button").click_gone()

    # Clip filstrip
    clips_trim = d(
        resourceId="com.instagram.android:id/clips_trim_filmstrip_view").exists(timeout=3.0)
    if clips_trim:
        i = 0
        while i < file_count:
            d(resourceId="com.instagram.android:id/trim_confirm_button").click()  # Add
            i += 1

        d(className="android.widget.Button", text="Preview").click()
    else:
        sleep(1.5)
        d(resourceId="com.instagram.android:id/next_button").click_exists(timeout=5.0)

        # Dialog
        if d(resourceId="com.instagram.android:id/dialog_container").exists(timeout=2.0):
            d(resourceId="com.instagram.android:id/primary_button").click_exists(timeout=2.0)

    # Sticker
    if bool(sticker):
        fprint('Add sticker for reel.')
        d(resourceId="com.instagram.android:id/add_text_button_v2").click()
        d.send_keys(sticker)

        d(resourceId="com.instagram.android:id/done_button").click()
        sleep(1.0)

        d(description="Sticker").drag_to(830, 1440)

        d(description="Done").click()
        fprint('Add sticker for reel success.')

    # Filter
    if bool(filter) and filter in REEL_FILTER:
        fprint(f'Choose filter \"{filter}\" for reel.')
        d(resourceId="com.instagram.android:id/camera_ar_effect_button").click(timeout=1.0)

        loading_id = "com.instagram.android:id/face_effect_loading_indicator"
        loading = d(resourceId=loading_id).exists(timeout=1.0)
        loading_index = 0
        while loading and loading_index < 15:
            loading_index += 1
            sleep(1.5)
            loading = d(resourceId=loading_id).exists(timeout=1.0)
            if loading == False:
                break

        filter_index = 0
        while filter_index < 12:
            d.swipe(900, 1570, 400, 1570, 0.3)
            for f in d.xpath('//*[@resource-id="com.instagram.android:id/post_capture_dial_picker"]/android.widget.FrameLayout/android.widget.ImageView').all():
                name = f.info.get('contentDescription')
                if name == filter:
                    f.click()
                    break
            else:
                filter_index += 1
                continue
            break

        d(resourceId="com.instagram.android:id/done_button").click_gone()
        fprint(f'Choose filter \"{filter}\" for reel success.')

    # Next third
    d.xpath('//*[@resource-id="com.instagram.android:id/clips_action_bar"]/android.widget.Button[2]').click(timeout=2.0)

    # Modal
    d(text="Don't allow").click_exists(2.0)

    # Input
    if bool(caption):
        fprint(f'Insert caption \"{caption}\" for reel.')
        input_box = d(
            resourceId="com.instagram.android:id/caption_input_text_view")
        if bool(input_box) == False:
            swipe_up(d)
            input_box = d(
                resourceId="com.instagram.android:id/caption_input_text_view")

        input_box.click()
        d.set_fastinput_ime()
        sleep(1.0)
        d.send_keys(caption, True)
        d.set_fastinput_ime(False)
        d.keyevent('111')  # close keyboard
        fprint(f'Insert caption \"{caption}\" for reel success.')

    # Share button
    d(resourceId="com.instagram.android:id/share_button").click_gone(2.0)

    # About reels
    d(resourceId="com.instagram.android:id/clips_nux_sheet_share_button").click_exists(1.0)

    snack_bar = d(
        resourceId="com.instagram.android:id/igds_upload_snackbar").exists(timeout=1.0)
    snack_bar_index = 0
    while snack_bar and snack_bar_index < 15:
        fprint('Posting ...')
        sleep(1.5)
        snack_bar_index += 1
        snack_bar = d(
            resourceId="com.instagram.android:id/igds_upload_snackbar").exists()
        if snack_bar == False:
            break

    print('Create a reel success.')


def swipe_page(d: Device, type: dict[str, str], times: int = 5) -> None:
    is_post = CONTENT_TYPE.get("Post") == type
    if is_post:
        go_home(d)
    else:
        go_reel(d)

    for _ in range(0, times):
        sleep(1.5)
        swipe_down(d)


def like_post(d: Device, times: int = 5) -> None:
    go_home(d)

    fprint("Like post start.")
    times_success = 0
    while times_success < times:
        like_btn = d(
            resourceId="com.instagram.android:id/row_feed_button_like", selected=False)
        while like_btn.exists() == False:
            swipe_down(d, 1500, 100)
            like_btn = d(
                resourceId="com.instagram.android:id/row_feed_button_like", selected=False)

        like_btn.click()
        sleep(0.3)
        swipe_down(d, 1500, 100)
        times_success += 1
        fprint(f'Like {times_success} times.')

    fprint('Like post success.')


def comment_post(d: Device, content: str) -> None:
    go_home(d)

    comment_btn = d(
        resourceId="com.instagram.android:id/row_feed_button_comment")
    while comment_btn.exists() == False:
        swipe_down(d, 1500, 100)
        comment_btn = d(
            resourceId="com.instagram.android:id/row_feed_button_comment")

    fprint(f'Comemnt post with content {content}.')
    comment_btn.click_gone()
    if d(resourceId="com.instagram.android:id/layout_comment_thread_edittext").exists(0.5):
        d.set_fastinput_ime()
        sleep(0.5)
        d.send_keys(content, True)
        d(resourceId="com.instagram.android:id/layout_comment_thread_post_button_click_area").click(timeout=0.5)

        posting = d(text="Posting…",
                    className="android.widget.TextView").exists(0.3)
        posting_index = 0

        fprint('Posting ...')
        while posting and posting_index < 10:
            sleep(0.5)
            posting = d(text="Posting…",
                        className="android.widget.TextView").exists(0.3)

            if posting == False:
                break

        d.set_fastinput_ime(False)
        fprint("Add comment success.")
    else:
        fprint("\"comment_post\" erorr")

    d(resourceId="com.instagram.android:id/action_bar_button_back").click_gone()


def like_reel(d: Device, times: int = 5) -> None:
    go_reel(d)

    fprint('Liek reel start.')
    times_success = 0
    while times_success < times:
        like_btn = d(
            resourceId="com.instagram.android:id/like_button", selected=False)
        while like_btn.exists() == False:
            swipe_down(d, 1500, 100)
            like_btn = d(
                resourceId="com.instagram.android:id/like_button", selected=False)

        like_btn.click()
        swipe_down(d, 1500, 100)
        times_success += 1
        fprint(f'Like {times_success} times.')

    fprint('Like post success.')
    go_home(d)


def comment_reel(d: Device, content: str) -> None:
    go_reel(d)

    comment_btn = d(description="Comment")
    while comment_btn.exists() == False:
        swipe_down(d, 1500, 100)
        comment_btn = d(description="Comment")

    comment_btn.click()
    fprint('Click comment reel button.')
    comment_input = d(
        resourceId="com.instagram.android:id/layout_comment_thread_edittext")
    if comment_input.exists(1.0):
        comment_input.click()

        fprint(f'Insert content {content}.')
        d.set_fastinput_ime()
        sleep(0.5)
        d.send_keys(content, True)

        d(resourceId="com.instagram.android:id/layout_comment_thread_post_button_click_area").click(timeout=0.5)
        posting = d(text="Posting…",
                    className="android.widget.TextView").exists(0.3)
        posting_index = 0

        while posting and posting_index < 10:
            fprint('Posting ...')
            sleep(0.5)
            posting = d(text="Posting…",
                        className="android.widget.TextView").exists(0.3)

            if posting == False:
                break
        d.set_fastinput_ime(False)

        fprint('Add comment for reel success.')
    else:
        fprint('"comment_reel" error.')

    d(resourceId="com.instagram.android:id/action_bar_button_back").click_gone()


def share_post(d: Device, num_of_acc: int = 5, content: str = '') -> None:
    go_home(d)

    share_btn = d(resourceId="com.instagram.android:id/row_feed_button_share")
    while share_btn.exists() == False:
        swipe_down(d, 1500, 100)
        share_btn = d(
            resourceId="com.instagram.android:id/row_feed_button_share")

    share_btn.click()
    fprint('Clicked Share button.')

    if bool(content):
        input = d(
            resourceId="com.instagram.android:id/direct_private_share_message_box")
        fprint(f'Insert content \"{content}\".')
        if input.exists(1.0):
            input.click()
            d.set_fastinput_ime()
            sleep(0.5)
            d.send_keys(content, True)
            d.keyevent('111')
            fprint(f'Insert content \"{content}\" success.')

    # Random times scroll
    for _ in range(0, randint(1, 3)):
        d(resourceId="com.instagram.android:id/direct_private_share_recipients_recycler_view").scroll()

    first = d.xpath(
        '//*[@resource-id="com.instagram.android:id/direct_private_share_recipients_recycler_view"]/android.widget.LinearLayout[1]/android.widget.Button[1]').get()
    users = [first]
    for c in d.xpath('//*[@resource-id="com.instagram.android:id/direct_private_share_recipients_recycler_view"]/android.widget.LinearLayout/android.widget.Button').all():
        users.append(c)
    users = list(dict.fromkeys(users))
    users.pop(-1)

    users_rand = []
    while len(users_rand) < num_of_acc:
        rand = choice(users)
        users_rand.append(rand)
        users_rand = list(dict.fromkeys(users_rand))

    for u in users_rand:
        u.click()
        s = u.info["contentDescription"]
        pt = r'Send to '
        _a, name = re.split(pt, s)
        fprint(f'Share post to account: \"{name}\".')

    d.set_fastinput_ime(False)
    sleep(3.0)
    d(resourceId="com.instagram.android:id/bb_primary_action").click_gone()
    fprint('Share post success. ')


def share_reel(d: Device, num_of_acc: int = 5, content: str = '') -> None:
    go_reel(d)
    fprint('Share reel start.')

    share_btn = d(description="Share")
    while share_btn.exists() == False:
        swipe_down(d, 1500, 100)
        share_btn = d(description="Share")

    share_btn.click()
    fprint('Clicked Share button.')

    if bool(content):
        input = d(
            resourceId="com.instagram.android:id/direct_private_share_message_box")
        fprint(f'Insert content \"{content}\" .')
        if input.exists(1.0):
            input.click()
            d.set_fastinput_ime()
            sleep(0.5)
            d.send_keys(content, True)
            d.keyevent('111')
            fprint(f'Insert content \"{content}\" success.')

    # Random times scroll
    for _ in range(0, randint(1, 3)):
        d(resourceId="com.instagram.android:id/direct_private_share_recipients_recycler_view").scroll()

    first = d.xpath(
        '//*[@resource-id="com.instagram.android:id/direct_private_share_recipients_recycler_view"]/android.widget.LinearLayout[1]/android.widget.Button[1]').get()
    users = [first]
    for c in d.xpath('//*[@resource-id="com.instagram.android:id/direct_private_share_recipients_recycler_view"]/android.widget.LinearLayout/android.widget.Button').all():
        users.append(c)
    users = list(dict.fromkeys(users))
    users.pop(-1)

    users_rand = []
    while len(users_rand) < num_of_acc:
        rand = choice(users)
        users_rand.append(rand)
        users_rand = list(dict.fromkeys(users_rand))

    for u in users_rand:
        u.click()
        s = u.info["contentDescription"]
        pt = r'Send to '
        _a, name = re.split(pt, s)
        fprint(f'Share reel to account: \"{name}\".')

    d.set_fastinput_ime(False)
    sleep(3.0)
    d(resourceId="com.instagram.android:id/bb_primary_action").click_gone()
    fprint('Share reel success. ')
