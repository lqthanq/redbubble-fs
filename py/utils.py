import re

from uiautomator2 import Device

from constants import (CAMERA_PATH, INSTAGRAM_APP_ID, MOVIES_IG_PATH,
                       MOVIES_PATH, PERMISSIONS, PICTURES_IG_PATH)


# Permission
def allow_permission(d: Device, appId: str = INSTAGRAM_APP_ID) -> None:
    for per in PERMISSIONS:
        d.shell('pm grant {} android.permission.{}'.format(appId, per))


def un_allow_permission(d: Device, appId: str = INSTAGRAM_APP_ID) -> None:
    for per in PERMISSIONS:
        d.shell('pm revoke {} android.permission.{}'.format(appId, per))


# ex = end x, ey = end y, du = duration (time)
def swipe_up(d: Device, ex: int = 500, ey: int = 1700, du: float = 0.2):
    d.swipe(250, ex, 250, ey, du)


def swipe_down(d: Device, ex: int = 1700, ey: int = 10, du: float = 0.4):
    d.swipe(250, ex, 250, ey, du)


# Files
def get_file(d: Device, path: str):
    str = d.shell('ls -R {}'.format(path))

    pattern = r'\n'
    l = re.split(pattern, str.output)
    l = [i for i in l if i]
    l.remove(l[0])  # remove folder name
    return l


def push_files(d: Device, files_to_push: list[str]):
    for file in files_to_push:
        pt = r'\.'
        file_splitted = re.split(pt, file)
        extra_file = file_splitted.pop()
        is_video = 'mp4' in extra_file

        target = CAMERA_PATH
        if is_video:
            target = MOVIES_PATH
        push_file(d, file, target)


def push_file(d: Device, dir: str, target: str):
    push_file = d.shell('push {} {}'.format(dir, target)).output

    pt = r'\/'
    split_path = re.split(pt, dir)
    file_name = split_path.pop()
    path = '{}/{}'.format(target, file_name)

    scan_file(d, path)
    return push_file


def delete_all_files(d: Device):
    images = get_file(d, CAMERA_PATH)
    delete_file(d, CAMERA_PATH, images)

    movies = get_file(d, MOVIES_PATH)
    delete_file(d, MOVIES_PATH, movies)

    images_ig = get_file(d, PICTURES_IG_PATH)
    delete_file(d, PICTURES_IG_PATH, images_ig)

    movies_ig = get_file(d, MOVIES_IG_PATH)
    delete_file(d, MOVIES_IG_PATH, movies_ig)


def delete_file(d: Device, path: str, file_names: list[str]):
    for i in range(0, len(file_names)):
        file_name = file_names[i]

        merge_path = "%s/%s" % (path, file_name)
        d.shell('rm -rf {}'.format(merge_path))
        scan_file(d, merge_path)


def scan_file(d: Device, path: str):
    d.shell('am broadcast -a android.intent.action.MEDIA_SCANNER_SCAN_FILE -d file://{}'.format(path))


def replace_file_name(old_name: str) -> str:
    pt = r'[`~!@#$%^&*()_|+\-=?;:\'\",<>\{\}\[\]\\\/]'
    new_name = re.sub(pt, '', old_name)

    return new_name


def go_home(d: Device) -> None:
    feed_tab = d(resourceId="com.instagram.android:id/feed_tab")
    if feed_tab.info["selected"] == False:
        feed_tab.click()


def go_reel(d: Device) -> None:
    clips_tab = d(resourceId="com.instagram.android:id/clips_tab")
    if clips_tab.info["selected"] == False:
        clips_tab.click()

def fprint(*values):
    print(values, flush=True)