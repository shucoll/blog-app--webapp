import Grid from '@material-ui/core/Grid';
import { makeStyles } from '@material-ui/core/styles';

import BlogCard from './BlogCard/BlogCard';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

const BlogCards = (props) => {
  const {data} = props;
  const classes = useStyles();
  
  return (
    <Grid container spacing={2} className={classes.root}>
      {data.map((item) => (
        <BlogCard data={item} key={item._id} editable={props.editable}/>
      ))}
    </Grid>
  );
};

export default BlogCards;
