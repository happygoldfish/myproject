from posts.views import posts_list
from posts.models import Post
import pytest
from django.contrib.auth import get_user_model

User = get_user_model()

@pytest.fixture
def post_entry(db):
    testUser = User.objects.create_user(username='testUser', password='testUser123')

    post = Post(
        title='Test Post', 
        body='Test Body', 
        slug='test_slug', 
        date_released='2026-01-01', 
        date_updated='2026-02-02', 
        banner="default_img.jpg", 
        author='testUser' 
    )
    post.save()
    return post    

def test_posts_list(client, post_entry):
    ret = client.get('/posts/')
    breakpoint()
    """
    assert ret.status_code == 200
    assert b'Test Post' in ret.data
    """

